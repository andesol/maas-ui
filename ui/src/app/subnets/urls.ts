import type { GroupByKey } from "./views/SubnetsList/SubnetsTable/types";

import type { Fabric, FabricMeta } from "app/store/fabric/types";
import type { Space, SpaceMeta } from "app/store/space/types";
import type { Subnet, SubnetMeta } from "app/store/subnet/types";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { argPath, isId } from "app/utils";

const urls = {
  index: "/networks",
  indexBy: ({ by }: { by?: GroupByKey } = { by: "fabric" }): string =>
    `/networks?by=${by}`,
  fabric: {
    index: argPath<{ id: Fabric[FabricMeta.PK] }>("/fabric/:id"),
  },
  space: {
    index: argPath<{ id: Space[SpaceMeta.PK] }>("/space/:id"),
  },
  subnet: {
    index: argPath<{ id: Subnet[SubnetMeta.PK] }>("/subnet/:id"),
  },
  vlan: {
    index: argPath<{ id: VLAN[VLANMeta.PK] }>("/vlan/:id"),
  },
};

const getFabricLink = (id?: Fabric["id"]): string | null =>
  isId(id) ? urls.fabric.index({ id }) : null;
const getSpaceLink = (id?: Space["id"]): string | null =>
  isId(id) ? urls.space.index({ id }) : null;
const getVLANLink = (id?: VLAN["id"]): string | null =>
  isId(id) ? urls.vlan.index({ id }) : null;
const getSubnetLink = (id?: Subnet["id"]): string | null =>
  isId(id) ? urls.subnet.index({ id }) : null;

export default urls;
export { getFabricLink, getSpaceLink, getVLANLink, getSubnetLink };
