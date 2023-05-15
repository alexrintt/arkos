// import {
//   Dialog,
//   Menu,
//   Transition as HeadlessTransition,
// } from "@headlessui/react";
// import {
//   InboxIcon,
//   IssueOpenedIcon,
//   ProjectRoadmapIcon,
//   BookIcon,
//   DownloadIcon,
//   TableIcon,
//   ThreeBarsIcon,
//   PaintbrushIcon,
//   CreditCardIcon,
//   RocketIcon,
//   HomeIcon,
//   MarkGithubIcon,
//   SmileyIcon,
//   LinkExternalIcon,
//   CodeIcon,
//   PlusIcon,
//   ArchiveIcon,
//   MoveToStartIcon,
//   PencilIcon,
//   DuplicateIcon,
//   TrashIcon,
//   CloudIcon,
//   ArrowDownIcon,
//   ArrowUpIcon,
//   ArrowSwitchIcon,
//   CheckIcon,
//   CopyIcon,
//   ProjectTemplateIcon,
//   CalendarIcon,
//   CircleIcon,
//   TagIcon,
//   ImageIcon,
//   HashIcon,
//   ArrowLeftIcon,
//   ArrowRightIcon,
// } from "@primer/octicons-react";
// import { PortalWithState } from "react-portal";
// import {
//   Dispatch,
//   Fragment,
//   MutableRefObject,
//   ReactElement,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useReducer,
//   useRef,
//   useState,
// } from "react";
// import { useMasterKeyGenerator, useStartTimeout } from "../login";
// import {
//   InputNumberFormat,
//   NumberFormatEventDetail,
// } from "@react-input/number-format";
// import { useHotkeys } from "react-hotkeys-hook";
// import localforage from "localforage";
// import { useSelector, useDispatch } from "react-redux";
// import { ApplicationState } from "../../redux";
// import {
//   TransactionAction,
//   TransactionActionType,
//   TransactionState,
// } from "../../redux/reducers/transaction";
// import { Portal } from "../../components/portal";
// import {
//   Transaction,
//   TransactionTemplate,
//   TransactionType,
// } from "../../services/model/transaction";
// import { ListTile } from "../../components/list-tile";
// import { useIsFirstRender, useToggle } from "usehooks-ts";
// import { Transition } from "react-transition-group";
// import ReactDOM from "react-dom";
// import { CreateTransactionDialog } from "../../components/create-transaction-dialog";
// import dayjs from "dayjs";
// // import { BoundingRect } from "./bounding-rect";

// export function formatCurrency(value: number): string {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   })
//     .formatToParts(value)
//     .map((e) => e.value)
//     .slice(1)
//     .join("");
// }

// export default function DashboardPage(): JSX.Element {
//   return (
//     <>
//       <button
//         data-drawer-target="logo-sidebar"
//         data-drawer-toggle="logo-sidebar"
//         aria-controls="logo-sidebar"
//         type="button"
//         className="inline-flex items-center p-2 mt-2 ml-2 text-sm text-t1 rounded-lg md:hidden"
//       >
//         <span className="sr-only">Open sidebar</span>
//         <svg
//           className="w-6 h-6"
//           aria-hidden="true"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             clipRule="evenodd"
//             fillRule="evenodd"
//             d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//           />
//         </svg>
//       </button>
//       <DashboardSidebar />
//       <DashboardContent />
//     </>
//   );
// }

// export function DashboardSidebar() {
//   return (
//     <aside
//       id="logo-sidebar"
//       className="fixed top-0 left-0 z-5 min-w-[13rem] h-screen transition-transform -translate-x-full sm:translate-x-0"
//       aria-label="Sidebar"
//     >
//       <div className="bg-s2 flex flex-col justify-evenly h-full px-3 py-4 overflow-y-auto">
//         <ul className="flex-1 space-y-0.5">
//           {/* <ListTile
//         text="Arkos"
//         leading={
//           <img
//             src="/opaque.svg"
//             className="w-6 h-6 text-gray-500 transition duration-75"
//             alt="Flowbite Logo"
//           />
//         }
//       /> */}
//           <SidebarListSectionCategory text="Main" />
//           <ListTile
//             text="Home"
//             leading={<HomeIcon fill="var(--t1)" size={14} />}
//           />
//           <ListTile
//             text="Templates"
//             leading={<ProjectTemplateIcon fill="var(--t1)" size={14} />}
//           />
//           <ListTile
//             text="Wallets"
//             leading={<CreditCardIcon fill="var(--t1)" size={14} />}
//           />
//           <ListTile
//             text="Goals"
//             leading={<RocketIcon fill="var(--t1)" size={14} />}
//           />
//           <ListTile
//             text="Icons"
//             leading={<HashIcon fill="var(--t1)" size={14} />}
//           />

//           <SidebarListSectionCategory text="General settings" />
//           <ListTile
//             text="Modify theme"
//             leading={<PaintbrushIcon fill="var(--t1)" size={14} />}
//           />
//           <ListTile
//             text="Column settings"
//             leading={<TableIcon fill="var(--t1)" size={14} />}
//           />

//           <SidebarListSectionCategory text="Backup (Data export)" />
//           <ListTile
//             text="Offline export/import"
//             leading={<DownloadIcon fill="var(--t1)" size={14} />}
//           />
//           <ListTile
//             text="Cloud export/import"
//             leading={<CloudIcon fill="var(--t1)" size={14} />}
//           />
//         </ul>
//         <div>
//           <ul className="space-y-0.5">
//             <ListTile
//               text="GitHub"
//               leading={<MarkGithubIcon fill="var(--t1)" size={14} />}
//               trailing={<LinkExternalIcon fill="var(--t1)" size={14} />}
//             />
//             <ListTile
//               text="By @alexrintt"
//               leading={<CodeIcon fill="var(--t1)" size={14} />}
//               trailing={<LinkExternalIcon fill="var(--t1)" size={14} />}
//             />
//           </ul>
//         </div>
//       </div>
//     </aside>
//   );
// }

// export interface IDateLabel {
//   date: string;
//   label?: string;
//   highlight?: boolean;
//   main?: boolean;
//   disabled?: boolean;
// }

// export function DateLabel({
//   date,
//   label,
//   highlight,
//   main,
//   disabled,
// }: IDateLabel) {
//   let style: Record<string, string> = {
//     container: "rounded-full flex items-center justify-center w-5 h-5 mb-0.5 ",
//     label: "text-xs whitespace-nowrap ",
//     date: "text-xs whitespace-nowrap ",
//   };

//   if (main) {
//     style.container += "bg-p1";
//     style.date += "text-s1";
//   } else if (highlight) {
//     style.container += "bg-s3";
//     style.label += "text-t1";
//   } else if (disabled) {
//     style.container += "";
//     style.label += "text-t1 opacity-50";
//     style.date += "text-t1 opacity-50";
//   } else {
//     style.container += "";
//     style.label += "text-t1";
//     style.date += "text-t1";
//   }

//   return (
//     <div
//       className={`pointer-events-none flex items-center justify-center pt-2 flex-col`}
//     >
//       {label && <span className={style.label}>{label}</span>}
//       <div className={style.container}>
//         <span className={style.date}>{date}</span>
//       </div>
//     </div>
//   );
// }

// export type ICalendarView = {
//   date?: dayjs.Dayjs;
//   slotBuilder?: (date: dayjs.Dayjs) => JSX.Element;
//   onClick?: (e: React.MouseEvent<HTMLElement>, target: dayjs.Dayjs) => void;
//   onDoubleClick?: (
//     e: React.MouseEvent<HTMLElement>,
//     target: dayjs.Dayjs
//   ) => void;
// };

// export function CalendarView({
//   date,
//   onClick,
//   slotBuilder,
//   onDoubleClick,
// }: ICalendarView) {
//   const current = date ?? dayjs();

//   // You must supply values that multiplied will be >= 31
//   const gridColumns = 7;

//   const firstDayOfTheCurrentMonth = current.set("date", 1);
//   const lastDayOfTheCurrentMonth = current.set("date", current.daysInMonth());

//   const totalDays = current.daysInMonth();
//   const previousMonthDayPreviewCount = firstDayOfTheCurrentMonth.day();

//   const gridRows = Math.ceil((previousMonthDayPreviewCount + totalDays) / 7);
//   const gridItemCount = gridRows * gridColumns;

//   const emptyCellCount = gridItemCount - totalDays;

//   const nextMonthDayPreviewCount =
//     emptyCellCount - previousMonthDayPreviewCount;

//   const previous = current.subtract(1, "month");
//   const next = current.add(1, "month");

//   const start = firstDayOfTheCurrentMonth.subtract(
//     previousMonthDayPreviewCount,
//     "days"
//   );
//   const end = lastDayOfTheCurrentMonth.add(
//     nextMonthDayPreviewCount + 1,
//     "days"
//   );
//   const count = end.diff(start, "days");

//   return (
//     <div
//       className={`bg-s2 grid gap-px h-full`}
//       style={{
//         gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
//         gridTemplateRows: `repeat(${gridRows}, 1fr)`,
//       }}
//     >
//       {Array.from({ length: count }).map((_, i) => {
//         const gridIndex = i;
//         const item = start.add(i, "days");

//         const isToday = item.isSame(dayjs(), "date");
//         const isFirstDayOfTheMonth = item.date() === 1;

//         const isFirstWeek = gridIndex <= gridColumns - 1;
//         const isLastWeek = gridIndex >= gridItemCount - gridColumns;

//         const formattedDay = item.format("ddd");
//         const formattedMonth = item.format("MMMM").substring(0, 3);

//         const isMainMonth = item.month() === current.month();

//         return (
//           <button
//             className="bg-s1 flex flex-col h-full"
//             data-key="date"
//             data-action="transaction-portal"
//             data-value={item.valueOf()}
//             key={item.valueOf()}
//             // onClick={(e) => onClick && onClick(e, item)}
//           >
//             <DateLabel
//               date={
//                 (isFirstDayOfTheMonth ? formattedMonth + " " : "") +
//                 item.date().toString()
//               }
//               label={isFirstWeek ? formattedDay : undefined}
//               main={isToday}
//               disabled={!isMainMonth}
//             />
//             {slotBuilder && (
//               <div className="flex-1 flex flex-col">{slotBuilder(item)}</div>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// export function useMouseMoveEvent(): MouseEvent | undefined {
//   const [mousePosition, setMousePosition] = useState<MouseEvent>();

//   useEffect(() => {
//     function trackMousePosition(e: MouseEvent) {
//       // [mousePosition, setMousePosition].current = e;
//       setMousePosition(e);
//     }

//     document.addEventListener("mousemove", trackMousePosition);

//     return () => document.removeEventListener("mousemove", trackMousePosition);
//   }, []);

//   return mousePosition;
// }

// export type MonthlyViewController = {
//   currentMonth: dayjs.Dayjs;
//   previousMonth: () => void;
//   nextMonth: () => void;
//   travelTo: (delta: number) => void;
// };

// export function useMonthlyView(
//   initial: dayjs.Dayjs = dayjs()
// ): MonthlyViewController {
//   const [currentMonth, setCurrentMonth] = useState(dayjs());
//   const travelTo = useCallback(
//     (delta: number) => setCurrentMonth(currentMonth.add(delta, "month")),
//     [currentMonth]
//   );
//   const previousMonth = useCallback(() => travelTo(-1), [travelTo]);
//   const nextMonth = useCallback(() => travelTo(1), [travelTo]);

//   return { currentMonth, previousMonth, nextMonth, travelTo };
// }

// export function DashboardContent() {
//   const dispatch = useDispatch();
//   const transaction = useSelector(
//     (state: ApplicationState) => state.transaction
//   );

//   const rootRef = useRef<HTMLDivElement>(null);

//   const monthlyViewController = useMonthlyView();
//   const { currentMonth, previousMonth, nextMonth, travelTo } =
//     monthlyViewController;

//   // const mousePositionRef = useMouseMoveEvent();

//   const [isPortalVisible, setIsPortalVisible] = useState<boolean>(false);

//   const [isCreateDialogVisible, toggleCreateDialogVisibility] =
//     useToggle(false);

//   const [prefilled, setPrefilled] = useState<Partial<Transaction> | undefined>(
//     undefined
//   );

//   const [currentContextMenuPosition, setCurrentContextMenuPosition] = useState<
//     DOMRect | undefined
//   >(undefined);

//   const [currentContextMenuTransaction, setCurrentContextMenuTransaction] =
//     useState<Transaction | undefined>();

//   // const nodeRef = useRef(null);
//   // const [inProp, setInProp] = useState(false);

//   // const isFirstRender = useIsFirstRender();

//   useEffect(() => {
//     async function initTransactionStoreState() {
//       dispatch({
//         type: TransactionActionType.init,
//       });
//       dispatch({
//         type: TransactionActionType.loadMore,
//       });
//     }

//     initTransactionStoreState();
//   }, []);

//   useEffect(() => {
//     function onClick(e: MouseEvent) {
//       const element = e.target as HTMLElement;

//       const action = element?.getAttribute("data-action");

//       switch (action) {
//         case "transaction-portal":
//           setIsPortalVisible(true);
//           // setPosition;
//           break;
//         case "edit":
//           setIsPortalVisible(false);
//           break;
//       }

//       return;

//       if (element?.hasAttribute("data-calendar-date")) {
//         if (isPortalVisible) {
//           setIsPortalVisible(false);
//         } else {
//           setPrefilled((prev) => ({
//             ...prev,
//             createdAt: Number(element.getAttribute("data-calendar-date")),
//           }));
//           setIsPortalVisible(true);
//         }
//       } else {
//       }
//     }

//     window.document.addEventListener("click", onClick);

//     return () => {
//       window.document.removeEventListener("click", onClick);
//     };
//   }, [isPortalVisible]);

//   return (
//     <div
//       ref={rootRef}
//       className="ml-[13rem] bg-s1 min-h-screen border-l h-full flex flex-col border-s3"
//     >
//       <CreateTransactionDialog
//         isOpen={isCreateDialogVisible}
//         template={prefilled}
//       />
//       {/* <Portal
//         isOpen={!!currentContextMenuPosition}
//         onDismiss={() => dismissContextMenuDropdown()}
//       >
//         <div className="p-1">
//           <ListTile
//             onClick={() => deleteContextMenuTransaction()}
//             leading={<TrashIcon fill="var(--danger)" size={14} />}
//             text="Delete"
//           />
//           <ListTile
//             onClick={() => openCreateDialog({ type: TransactionType.outcome })}
//             leading={<ArrowDownIcon fill="var(--t1)" size={14} />}
//             text="Edit"
//           />
//         </div>
//       </Portal> */}
//       <Portal isOpen={!!isPortalVisible}>
//         <>
//           <div className="p-1">
//             <ListTile
//               // onClick={() => openCreateDialog({ type: TransactionType.income })}
//               leading={<ArrowUpIcon fill="var(--green)" size={14} />}
//               text="New income"
//             />
//             <ListTile
//               // onClick={() =>
//               //   openCreateDialog({ type: TransactionType.outcome })
//               // }
//               leading={<ArrowDownIcon fill="var(--danger)" size={14} />}
//               text="New outcome"
//             />
//             <ListTile
//               // onClick={() => openCreateDialog({ type: TransactionType.swap })}
//               leading={<ArrowSwitchIcon fill="var(--t1)" size={14} />}
//               text="New swap"
//             />
//           </div>
//           <Divider />
//           <div className="px-1 py-1">
//             <ListTile
//               leading={<ProjectTemplateIcon fill="var(--t1)" size={14} />}
//               text="Create from template"
//             />
//             <ListTile
//               leading={<DownloadIcon fill="var(--t1)" size={14} />}
//               text="Import from file"
//             />
//             <ListTile
//               leading={<CloudIcon fill="var(--t1)" size={14} />}
//               text="Import from cloud"
//             />
//           </div>
//           <Divider />
//           <div className="px-1 py-1">
//             <ListTile
//               leading={<CreditCardIcon fill="var(--t1)" size={14} />}
//               text="Create wallet"
//             />
//             <ListTile
//               leading={<RocketIcon fill="var(--t1)" size={14} />}
//               text="Create goal"
//             />
//           </div>
//         </>
//       </Portal>
//       <CalendarHeader controller={monthlyViewController} />
//       <div
//         onWheel={(e) => {
//           if (e.deltaY < 0) {
//             previousMonth();
//           } else {
//             nextMonth();
//           }
//         }}
//         className="flex-1 bg-red-200 overflow-hidden"
//       >
//         <CalendarView
//           date={currentMonth}
//           // onClick={(e, date) => {
//           //   setPrefilled((prev) => ({ ...prev, createdAt: date.valueOf() }));
//           //   setIsPortalVisible(true);
//           // }}
//           // onDoubleClick={(e, date) => {
//           //   openCreateDialog({ ...prefilled, createdAt: date.valueOf() });
//           // }}
//           slotBuilder={(date) => (
//             <CalendarSlot
//               date={date}
//               transactionGroupedByDate={transaction.groupedByDate}
//             />
//           )}
//         />
//       </div>
//     </div>
//   );
// }

// export type ICalendarSlot = {
//   date: dayjs.Dayjs;
//   transactionGroupedByDate: Record<string, Transaction[]>;
// };

// export function CalendarSlot({
//   date,
//   transactionGroupedByDate,
// }: ICalendarSlot) {
//   const key = date.format("DD-MM-YYYY");

//   const nodes = [...(transactionGroupedByDate[key] ?? [])].sort(
//     (a, z) => (z.createdAt ?? 0) - (a.createdAt ?? 0)
//   );

//   const showMoreBtn = nodes.length > 5;

//   const mostRecentNodes = showMoreBtn ? nodes.slice(0, 4) : nodes;

//   return (
//     <>
//       {mostRecentNodes.map((node) => {
//         let typeStyle: string;

//         switch (node?.type) {
//           case TransactionType.income:
//             typeStyle = `border-green`;
//             break;
//           case TransactionType.outcome:
//             typeStyle = `border-danger`;
//             break;
//           case TransactionType.swap:
//             typeStyle = `border-grey-200`;
//             break;
//           default:
//             typeStyle = "border-transparent";
//         }

//         return (
//           <button
//             data-key="transaction"
//             data-action="edit"
//             data-value={node.id}
//             key={node.id}
//             // onClick={(e) => {
//             //   onClick(node);
//             // }}
//             // onContextMenu={(e) => {
//             //   e.preventDefault();
//             //   e.stopPropagation();
//             //   onRightClick(node);
//             //   return false;
//             // }}
//             className={`text-xs mb-0.5 bg-s2 pl-1 rounded text-start border-0 border-l-4 p-1 mr-2 ${typeStyle}`}
//           >
//             {node.title} -{" "}
//             {node.amount ? "$" + formatCurrency(node.amount) : "No amount"}
//           </button>
//         );
//       })}
//       {showMoreBtn && (
//         <button className="text-xs mb-0.5 bg-s2 rounded p-0.5 mr-2">
//           Show more {nodes.length - mostRecentNodes.length}
//         </button>
//       )}
//     </>
//   );
// }

// export type ICalendarHeader = {
//   controller: MonthlyViewController;
// };

// export function CalendarHeader({ controller }: ICalendarHeader) {
//   const { currentMonth, previousMonth, nextMonth, travelTo } = controller;

//   return (
//     <header className="flex p-2 bg-s2 border-b border-s3">
//       <button
//         onClick={() => travelTo(-1)}
//         className="bg-s2 shadow w-7 h-7 border-s3 p-1 flex justify-center items-center"
//       >
//         <ArrowLeftIcon fill="var(--t1)" size={14} />
//       </button>
//       <div className="p-1"></div>
//       <button
//         onClick={() => travelTo(1)}
//         className="bg-s2 shadow w-7 h-7 aspect-square border-s3 p-1 flex justify-center items-center"
//       >
//         <ArrowRightIcon fill="var(--t1)" size={14} />
//       </button>
//       <div className="p-2"></div>
//       <div className="text-lg flex items-center">
//         {currentMonth.format("MMMM YYYY")}
//       </div>
//     </header>
//   );
// }

// export function Divider() {
//   return <hr />;
// }

// export type IShowModalOptions = {};

// export function useShowModal() {
//   function showModal(parent?: HTMLElement) {
//     let root = parent ?? document.getElementById("root");
//     ReactDOM.createPortal;
//   }

//   return showModal;
// }

// export type IModal = {
//   content: JSX.Element;
//   isVisible: boolean;
//   onDismiss: () => void;
// };

// const invisibleStyle = `pointer-events-none opacity-0`;
// const visibleStyle = `pointer-events-auto opacity-100`;

// export function Modal({ content, isVisible, onDismiss }: IModal) {
//   function getBarrierStyle() {
//     const base = `absolute top-0 bottom-0 right-0 left-0 bg-black opacity-50`;
//     const dynamic = isVisible ? visibleStyle : invisibleStyle;
//     return `${base} ${dynamic}`;
//   }
//   function getContentStyle() {
//     const base = `h-full-w-full flex justify-center-items-center`;
//     const dynamic = isVisible ? visibleStyle : invisibleStyle;
//     return `${base} ${dynamic}`;
//   }

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0" onClick={onDismiss}>
//       <div className="relative w-full h-full">
//         <div className={getBarrierStyle()}></div>
//         <div className={getContentStyle()}>{content}</div>
//       </div>
//     </div>
//   );
// }
