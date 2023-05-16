import {
  CloudIcon,
  CodeIcon,
  CreditCardIcon,
  DownloadIcon,
  HashIcon,
  HomeIcon,
  LinkExternalIcon,
  MarkGithubIcon,
  PaintbrushIcon,
  ProjectTemplateIcon,
  RocketIcon,
  TableIcon,
} from "@primer/octicons-react";
import { ListTile } from "../list-tile";
import { Calendar } from "../../pages/calendar";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../pages/icon";
import ReactModal from "react-modal";
import {
  selectTransactionModalIsOpen,
  useCloseTransactionModal,
} from "../../redux/reducers/transaction-modal";
import { useSelector } from "react-redux";
import { TransactionModal } from "../transaction-modal";
import { Dialog } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import { Fade } from "../fade";

export enum SidebarSection {
  main = "Main",
  general = "General",
  backup = "Backup",
}

export type SidebarItem = {
  title: string;
  path: string;
  icon: React.FC;
  section: SidebarSection;
};

export function Layout({ children }: React.PropsWithChildren) {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        title: "Home",
        icon: () => <HomeIcon fill="var(--t1)" size={14} />,
        path: Calendar.basePath,
        section: SidebarSection.main,
      },
      {
        title: "Icons",
        icon: () => <HashIcon fill="var(--t1)" size={14} />,
        path: Icon.basePath,
        section: SidebarSection.main,
      },
    ],
    []
  );

  const sidebarItemsGroupedBySection: Record<SidebarSection, SidebarItem[]> =
    useMemo(() => {
      return Object.values(SidebarSection)
        .map((section): [SidebarSection, SidebarItem[]] => {
          const items = sidebarItems.filter((e) => e.section === section);
          return [section, items];
        })
        .reduce(
          (acc, [section, items]): Record<SidebarSection, SidebarItem[]> => {
            return {
              ...acc,
              [section]: items,
            };
          },
          {} as Record<SidebarSection, SidebarItem[]>
        );
    }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const transactionModalIsOpen = useSelector(selectTransactionModalIsOpen());
  const closeTransactionModal = useCloseTransactionModal();

  return (
    <div className="flex w-full h-full">
      <>
        {/* <ReactModal
          isOpen={}
          parentSelector={() => document.querySelector("#root")!}
        >
        </ReactModal> */}
        <Fade in={transactionModalIsOpen}>
          <div
            className="fixed top-0 left-0 right-0 bottom-0 z-[10000]"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed top-0 left-0 bottom-0 right-0 flex z-[200] justify-center items-center h-full w-full">
              <div
                className="fixed z-[100] inset-0 bg-black opacity-25 top-0 left-0 right-0 bottom-0"
                onClick={closeTransactionModal}
              />
              <div className="fixed w-full max-w-xl z-[200] top-[25%] shadow-xl flex justify-center items-center">
                <TransactionModal />
              </div>
            </div>
          </div>
        </Fade>
      </>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-5 min-w-[13rem] h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="bg-s2 flex flex-col justify-evenly h-full px-3 py-4 overflow-y-auto">
          <ul className="flex-1 space-y-0.5">
            {/* <ListTile
              text="Arkos"
              leading={
                <img
                  src="/opaque.svg"
                  className="w-6 h-6 text-gray-500 transition duration-75"
                  alt="Flowbite Logo"
                />
              }
            /> */}
            {Object.entries(sidebarItemsGroupedBySection).map(
              ([section, items], index) => {
                return (
                  <React.Fragment key={section.toString()}>
                    <SidebarListSectionCategory text={section} />
                    {items.map((e) => {
                      const { icon: Icon, title, path } = e;

                      return (
                        <ListTile
                          onClick={() => navigate(e.path)}
                          key={title}
                          active={location.pathname.startsWith(path)}
                          text={title}
                          leading={<Icon />}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              }
            )}
            {/* <SidebarListSectionCategory text="Main" />
            <ListTile
              text="Home"
              leading={<HomeIcon fill="var(--t1)" size={14} />}
            />
            <ListTile
              text="Wallets"
              leading={<CreditCardIcon fill="var(--t1)" size={14} />}
            />
            <ListTile
              text="Goals"
              leading={<RocketIcon fill="var(--t1)" size={14} />}
            />
            <ListTile
              text="Icons"
              leading={<HashIcon fill="var(--t1)" size={14} />}
            />

            <SidebarListSectionCategory text="General settings" />
            <ListTile
              text="Modify theme"
              leading={<PaintbrushIcon fill="var(--t1)" size={14} />}
            />
            <ListTile
              text="Column settings"
              leading={<TableIcon fill="var(--t1)" size={14} />}
            />

            <SidebarListSectionCategory text="Backup (Data export)" />
            <ListTile
              text="Offline export/import"
              leading={<DownloadIcon fill="var(--t1)" size={14} />}
            />
            <ListTile
              text="Cloud export/import"
              leading={<CloudIcon fill="var(--t1)" size={14} />}
            /> */}
          </ul>
          <div>
            <ul className="space-y-0.5">
              <ListTile
                text="GitHub"
                leading={<MarkGithubIcon fill="var(--t1)" size={14} />}
                trailing={<LinkExternalIcon fill="var(--t1)" size={14} />}
              />
              <ListTile
                text="By @alexrintt"
                leading={<CodeIcon fill="var(--t1)" size={14} />}
                trailing={<LinkExternalIcon fill="var(--t1)" size={14} />}
              />
            </ul>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-[13rem] border-l border-s3 w-full h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export type ISidebarListSectionCategory = {
  text: string;
};

export function SidebarListSectionCategory(
  props: ISidebarListSectionCategory
): JSX.Element {
  return (
    <li>
      <span className="mt-3 flex items-center pl-1.5 pt-2 pb-0.5 text-t1 text-sm rounded-md">
        <span className="flex-1 text-xs text-t0 whitespace-nowrap">
          {props.text}
        </span>
      </span>
    </li>
  );
}
