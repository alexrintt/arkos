import dayjs from "dayjs";
import {
  Navigate,
  RouteObject,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import Joi from "joi";

import { Layout } from "../../components/layout";

export type IIconParams = {
  month: number;
  year: number;
};

export const JANUARY = 0;
export const DECEMBER = 11;

const IconParamsSchema = Joi.object<IIconParams>({}).required();

function generateIconPath(params?: IIconParams): string {
  return IconPath.listIcons;
}

const b = "/i";

export enum IconPath {
  listIcons = b + "/",
}

const routes: RouteObject[] = [
  {
    path: IconPath.listIcons,
    element: <IconPage />,
  },
];

export const Icon = {
  Page: IconPage,
  basePath: b,
  routes: routes,
};

export type IIconPage = {};

function IconPage(props: IIconPage) {
  return (
    <Layout>
      <div className="flex justify-center py-12">
        <div className="w-full max-w-3xl overflow-hidden border border-s2">
          <div className="w-full p-3 bg-s2 flex justify-between items-center">
            <span className="text-xs">11 Labels</span>
            <button className="bg-p2 px-4 py-1 rounded text-xs text-s1 shadow">
              New label
            </button>
          </div>
          {Array.from({ length: 10 }).map((_, i) => {
            return (
              <div className="flex items-center p-2 border-b border-s2">
                <div className="rounded-full bg-w1 w-6 h-full relative bg-opacity-5 text-w1 px-3 border-opacity-25 py-1 text-xs overflow-hidden"></div>
                <div className="text-xs text-p1 p-0 pl-2 text-w1">
                  Spotify Premium
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
