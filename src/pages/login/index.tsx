import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { LogoGithubIcon, MarkGithubIcon } from "@primer/octicons-react";
import LineDecoration from "../../components/line-decoration";
import { SiGoogle, SiGithub } from "@icons-pack/react-simple-icons";
import {
  KeyIcon,
  InfoIcon,
  CopyIcon,
  CheckIcon,
  EyeClosedIcon,
  EyeIcon,
} from "@primer/octicons-react";
import { Dialog, Transition } from "@headlessui/react";
import * as openpgp from "openpgp";
import {
  GithubAuthProvider,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  db,
  doc,
  firebaseAuth,
  getDoc,
  getDocFromServer,
} from "../../firebase";
import {
  useCopyToClipboard,
  useIsMounted,
  useTimeout,
  useToggle,
} from "usehooks-ts";
import rsa from "js-crypto-rsa"; // for npm
import aes from "js-crypto-aes"; // for npm
import pbkdf from "js-crypto-pbkdf";
import hash from "js-crypto-hash";
import { setDoc } from "firebase/firestore";
import { Input, InputTrailing } from "../../components/input";

function downloadTxtFile(str: string, filename: string) {
  // Create a new Blob object with the string as data
  const blob = new Blob([str], { type: "text/plain" });

  // Create a link element with the download attribute and the file name
  const link = document.createElement("a");
  link.download = filename;

  // Add the Blob object URL as the link's href attribute
  link.href = window.URL.createObjectURL(blob);

  // Append the link to the DOM and click it programmatically to download the file
  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link and revoking the Blob object URL
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}

async function encrypt(message: string, password: string): Promise<string> {
  const key = Uint8Array.from(Buffer.from(password, "hex")); // 16 bytes or 32 bytes key in Uint8Array
  const iv = Buffer.from(password, "hex").subarray(0, 12); // 12 bytes IV in Uint8Array for AES-GCM mode

  return Buffer.from(
    await aes.encrypt(Uint8Array.from(Buffer.from(message, "utf8")), key, {
      name: "AES-GCM",
      iv,
      tagLength: 16,
    })
  ).toString("hex");
}

async function decrypt(
  encryptedMessage: string,
  password: string
): Promise<string> {
  const key = Uint8Array.from(Buffer.from(password, "hex")); // 16 bytes or 32 bytes key in Uint8Array
  const iv = Buffer.from(password, "hex").subarray(0, 12); // 12 bytes IV in Uint8Array for AES-GCM mode

  return Buffer.from(
    await aes.decrypt(Buffer.from(encryptedMessage, "hex"), key, {
      name: "AES-GCM",
      iv,
      tagLength: 16,
    })
  ).toString("utf8");
}

async function sha256(message: Uint8Array): Promise<Buffer> {
  return Buffer.from(await hash.compute(message, "SHA-256"));
}

async function pbkdf2(p: Uint8Array | string): Promise<Buffer> {
  let password: Uint8Array;

  if (typeof p === "string") {
    password = Buffer.from(p, "utf8");
  } else {
    password = p;
  }

  const salt = password;
  const iterationCount = 2048;
  const derivedKeyLen = 32;
  const hash = "SHA-256"; // 'SHA-384', 'SHA-512', 'SHA-1', 'MD5', 'SHA3-512', 'SHA3-384', 'SHA3-256', or 'SHA3-224'

  return Buffer.from(
    await pbkdf.pbkdf2(password, salt, iterationCount, derivedKeyLen, hash)
  );
}

type JsonWebKeyPair = {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
};

export type UserLocalCredentials = {
  secretPlainMasterKey: string;
  secretMasterKey: string;
  publicMasterKeyId: string;
};

async function generateUserLocalCredentials(
  secretPlainMasterKey: string
): Promise<UserLocalCredentials> {
  // Derive the plain password to avoid working with the raw password.
  // Also difficults the brute-force attack, since [pbkdf2] is slow (it helps weak passwords, but strong ones are the best).
  const secretMasterKeyBuff = await pbkdf2(secretPlainMasterKey);

  // ID of this account, derivated from also derivated password.
  // Difficult brute-force attack from those who have access to the database.
  const publicMasterKeyIdBuff = await pbkdf2(secretMasterKeyBuff);

  return {
    secretPlainMasterKey: Buffer.from(secretPlainMasterKey).toString("hex"),
    secretMasterKey: secretMasterKeyBuff.toString("hex"),
    publicMasterKeyId: publicMasterKeyIdBuff.toString("hex"),
  };
}

function LoginPage() {
  const [plainMasterKey, setPlainMasterKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMasterKeyVisible, toggleIsMasterKeyVisible] = useToggle(false);

  async function createKeyPair(): Promise<JsonWebKeyPair> {
    return await rsa.generateKey();
  }

  async function loginByDerivingLocalKeysFromMasterPassword() {
    const localCredentials = await generateUserLocalCredentials(plainMasterKey);

    const userKeyPairsRef = collection(db, "keypairs");

    const userKeyPairRef = doc(
      userKeyPairsRef,
      localCredentials.publicMasterKeyId
    );

    const userKeyPairSnapshot = await getDocFromServer(userKeyPairRef);

    if (userKeyPairSnapshot.exists()) {
      // user already exists, load the public and private keys and decrypt.
      const rawKeyPair = userKeyPairSnapshot.data();

      // rsa.sign()

      const keyPair: JsonWebKeyPair = {
        privateKey: JSON.parse(
          await decrypt(rawKeyPair.privateKey, localCredentials.secretMasterKey)
        ),
        publicKey: JSON.parse(
          await decrypt(
            // Why encrypt a public RSA key?
            // - Even though it's a public RSA key, the user can opt-in to not share it with others.
            rawKeyPair.publicKey,
            localCredentials.secretMasterKey
          )
        ),
      };
    } else {
      // user signining for the first time, generate keys, encrypt and send to firestore.

      const keyPair = await createKeyPair();

      await setDoc(userKeyPairRef, {
        privateKey: await encrypt(
          JSON.stringify(keyPair.privateKey),
          localCredentials.secretMasterKey
        ),
        publicKey: await encrypt(
          // Why encrypt a public RSA key?
          // Even though it's a public RSA key, the user can opt-in to not share it with others.
          JSON.stringify(keyPair.publicKey),
          localCredentials.secretMasterKey
        ),
      });
    }

    // encrypt(derivedMasterKeyId, derivedMasterKey);

    // const encryptedMsg = await encrypt("Hi", derivedMasterKey);

    // const messageX = await openpgp.createMessage({
    //   text: "Hi i am here",
    // });
    // const keyPairA = await createKeyPair("123");
    // const keyPairB = await createKeyPair("123");
    // const publicKeyA = await openpgp.readKey({
    //   armoredKey: keyPairA.publicKey,
    // });
    // const privateKeyA = await openpgp.decryptKey({
    //   privateKey: await openpgp.readPrivateKey({
    //     armoredKey: keyPairA.privateKey,
    //   }),
    //   passphrase: "123",
    // });
    // const encryptedArmoredMessageX = await openpgp.encrypt({
    //   message: messageX,
    //   encryptionKeys: publicKeyA,
    //   format: "armored",
    // });
    // const encryptedMessageX = await openpgp.readMessage({
    //   armoredMessage: encryptedArmoredMessageX, // parse armored message
    // });
    // const decryptedMessageX = await openpgp.decrypt({
    //   message: encryptedMessageX,
    //   decryptionKeys: privateKeyA,
    // });
  }

  return (
    <>
      <div className="login-wrapper w-full h-full flex justify-center items-center flex-col">
        <div className="login-glow"></div>
        <LineDecoration />
        <img
          className="logo-wrapper rounded-full"
          src="./opaque.svg"
          alt="Arkos Logo"
          width={84}
        />
        <h2 className="text-lg p-6 font-medium text-p2">Log in to Arkos</h2>
        <div className="container flex justify-center flex-col max-w-xs">
          <Input
            id={"plain-master-key"}
            type={isMasterKeyVisible ? "text" : "password"}
            value={plainMasterKey}
            onChange={(e) => setPlainMasterKey(e.target.value)}
            placeholder={"Enter your master key"}
            trailing={
              isMasterKeyVisible ? (
                <InputTrailing
                  bgColor="s1"
                  color="t1"
                  icon={<EyeIcon />}
                  attrs={{
                    onClick: toggleIsMasterKeyVisible,
                  }}
                />
              ) : (
                <InputTrailing
                  bgColor="s1"
                  color="t1"
                  icon={<EyeClosedIcon />}
                  attrs={{
                    onClick: toggleIsMasterKeyVisible,
                  }}
                />
              )
            }
          />
          <button
            onClick={loginByDerivingLocalKeysFromMasterPassword}
            className="mb-3 bg-p1 font-semibold border-s3 w-full shadow flex items-center justify-center text-s1"
          >
            <KeyIcon fill="var(--s1)" size={16} />
            <span className="pr-3"></span> Login
          </button>
          <div className="mb-3">
            <button
              type="button"
              className="text-sm inline-block rounded p-0"
              onClick={() => setIsModalOpen(true)}
            >
              Or generate a new master key
            </button>
          </div>
          <hr />
          <p className="text-xs mt-2">
            <InfoIcon fill="var(--t1)" size={11} /> This is an end-to-end
            encrypted service, which means that if you lose or compromise your
            master key, you will no longer be able to access your account.
            Please keep your master key{" "}
            <a href="https://github.com/Lissy93/awesome-privacy#password-managers">
              safe and secure
            </a>
            .
          </p>
        </div>
      </div>
      <MasterKeyGeneratorDialog
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
      />
    </>
  );
}

interface IMasterKeyGeneratorDialog {
  isOpen: boolean;
  onDismiss: () => void;
}

export function useMasterKeyGenerator(): [string | void, () => Promise<void>] {
  const [masterKey, setMasterKey] = useState<string | void>(undefined);

  async function generateMasterKey(length = 256) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      password += charset.charAt(randomValues[i] % charset.length);
    }
    return password;
  }

  async function generateNewMasterKey() {
    setMasterKey(undefined);

    const masterKey = await generateMasterKey();

    setMasterKey(masterKey);
  }

  useEffect(() => {
    generateNewMasterKey();
  }, []);

  return [masterKey, generateNewMasterKey];
}

export function useStartTimeout() {
  const timeoutId = useRef<number>();

  function startTimeout(callback: () => void, ms: number) {
    if (timeoutId.current) {
      cancelTimeout();
    }

    timeoutId.current = window.setTimeout(callback, ms);
  }

  function cancelTimeout() {
    window.clearTimeout(timeoutId.current);
    timeoutId.current = undefined;
  }

  useEffect(() => {
    return () => cancelTimeout();
  }, []);

  return [startTimeout, cancelTimeout];
}

function MasterKeyGeneratorDialog({
  isOpen,
  onDismiss,
}: React.PropsWithoutRef<IMasterKeyGeneratorDialog>) {
  const [masterKey, generateNewMasterKey] = useMasterKeyGenerator();
  const [copied, setCopied] = useState(false);
  const [startTimeout] = useStartTimeout();
  const [_, copyToClipboard] = useCopyToClipboard();

  function copyMasterKeyToClipboard() {
    if (!masterKey) return;
    copyToClipboard(masterKey);
    setCopied(true);
    startTimeout(() => setCopied(false), 1000);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onDismiss}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-s1 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-s1 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="mb-4 text-base font-semibold leading-6 text-p3"
                      >
                        Master Key Generator
                      </Dialog.Title>
                      <div className="mt-2 w-full">
                        <Input
                          type="text"
                          readOnly={true}
                          autoFocus={false}
                          value={masterKey ?? "Generating..."}
                          trailing={
                            copied ? (
                              <InputTrailing
                                attrs={{
                                  onClick: copyMasterKeyToClipboard,
                                }}
                                icon={<CheckIcon fill="var(--s1)" />}
                              />
                            ) : (
                              <InputTrailing
                                attrs={{
                                  onClick: copyMasterKeyToClipboard,
                                  title: "Copy to clipboard",
                                }}
                                icon={<CopyIcon fill="var(--s1)" />}
                              />
                            )
                          }
                        />
                        <button
                          onClick={() => generateNewMasterKey()}
                          className="p-0 text-p3 hover:text-p1 bg-transparent text-sm mb-3"
                        >
                          Generate a new master key
                        </button>
                        <ul className="list-disc text-sm space-y-2">
                          <li>
                            Make sure to copy your personal master key now as
                            you will not be able to see this again.
                          </li>
                          <li>
                            This is an end-to-end encrypted service, which means
                            that{" "}
                            <span className="text-danger-500">
                              if you lose your master key, you will no longer be
                              able to access your account
                            </span>
                            .
                          </li>
                          <li>
                            If you leak your master key{" "}
                            <span className="text-danger-500">
                              other person will have access to your account
                            </span>
                            .
                          </li>
                          <li>
                            Please keep your master key{" "}
                            <a href="https://github.com/Lissy93/awesome-privacy#password-managers">
                              safe and secure
                            </a>
                            .
                          </li>
                          <li>
                            Keep in mind that the{" "}
                            <a href="https://github.com/henry-richard7/Browser-password-stealer">
                              browser built-in password manager is not secure
                            </a>
                            .
                          </li>
                          <li>
                            Do not use short or simple master keys (such as
                            common words) because there is a risk that another
                            person may also use the same or similar key, causing
                            a conflict or security issue.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-s2 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-p1 px-3 py-2 text-sm font-semibold text-s1 shadow-sm ring-1 ring-inset ring-p3 hover:bg-p2 sm:mt-0 sm:w-auto"
                    onClick={onDismiss}
                  >
                    Ok, got it
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default LoginPage;
