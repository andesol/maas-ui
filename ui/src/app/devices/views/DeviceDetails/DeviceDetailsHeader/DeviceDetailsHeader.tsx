import { useState } from "react";

import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import DeviceName from "./DeviceName";

import NodeActionMenu from "app/base/components/NodeActionMenu";
import SectionHeader from "app/base/components/SectionHeader";
import DeviceHeaderForms from "app/devices/components/DeviceHeaderForms";
import { DeviceHeaderViews } from "app/devices/constants";
import type {
  DeviceHeaderContent,
  DeviceSetHeaderContent,
} from "app/devices/types";
import deviceURLs from "app/devices/urls";
import { getHeaderTitle } from "app/devices/utils";
import deviceSelectors from "app/store/device/selectors";
import type { Device } from "app/store/device/types";
import { isDeviceDetails } from "app/store/device/utils";
import type { RootState } from "app/store/root/types";

type Props = {
  headerContent: DeviceHeaderContent | null;
  setHeaderContent: DeviceSetHeaderContent;
  systemId: Device["system_id"];
};

const DeviceDetailsHeader = ({
  headerContent,
  setHeaderContent,
  systemId,
}: Props): JSX.Element => {
  const [editingName, setEditingName] = useState(false);
  const device = useSelector((state: RootState) =>
    deviceSelectors.getById(state, systemId)
  );
  const { pathname } = useLocation();

  if (!device) {
    return <SectionHeader loading />;
  }

  return (
    <SectionHeader
      buttons={[
        <NodeActionMenu
          nodes={[device]}
          nodeDisplay="device"
          onActionClick={(action) => {
            const view = Object.values(DeviceHeaderViews).find(
              ([, actionName]) => actionName === action
            );
            if (view) {
              setHeaderContent({ view });
            }
          }}
        />,
      ]}
      headerContent={
        headerContent && (
          <DeviceHeaderForms
            devices={[device]}
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
            viewingDetails
          />
        )
      }
      subtitleLoading={!isDeviceDetails(device)}
      tabLinks={[
        {
          active: pathname.startsWith(
            deviceURLs.device.summary({ id: systemId })
          ),
          component: Link,
          label: "Summary",
          to: deviceURLs.device.summary({ id: systemId }),
        },
        {
          active: pathname.startsWith(
            deviceURLs.device.network({ id: systemId })
          ),
          component: Link,
          label: "Network",
          to: deviceURLs.device.network({ id: systemId }),
        },
        {
          active: pathname.startsWith(
            deviceURLs.device.configuration({ id: systemId })
          ),
          component: Link,
          label: "Configuration",
          to: deviceURLs.device.configuration({ id: systemId }),
        },
      ]}
      title={
        headerContent ? (
          getHeaderTitle(device.fqdn || "", headerContent)
        ) : (
          <DeviceName
            data-testid="DeviceName"
            editingName={editingName}
            id={systemId}
            setEditingName={setEditingName}
          />
        )
      }
    />
  );
};

export default DeviceDetailsHeader;
