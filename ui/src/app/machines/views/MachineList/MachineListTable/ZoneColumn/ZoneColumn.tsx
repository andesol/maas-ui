import { memo, useEffect, useState } from "react";

import { Spinner, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import { useToggleMenu } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineMeta } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";
import zoneSelectors from "app/store/zone/selectors";
import type { Zone, ZoneMeta } from "app/store/zone/types";

type Props = {
  onToggleMenu?: (systemId: Machine[MachineMeta.PK], open: boolean) => void;
  systemId: Machine[MachineMeta.PK];
};

const getSpaces = (machine: Machine) => {
  if (machine.spaces.length > 1) {
    const sorted = [...machine.spaces].sort();
    return (
      <Tooltip position="btm-left" message={sorted.join("\n")}>
        <span data-testid="spaces">{`${machine.spaces.length} spaces`}</span>
      </Tooltip>
    );
  }
  return (
    <span data-testid="spaces" title={machine.spaces[0]}>
      {machine.spaces[0]}
    </span>
  );
};

export const ZoneColumn = ({
  onToggleMenu,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState<Zone[ZoneMeta.PK] | null>(null);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const zones = useSelector(zoneSelectors.all);
  const toggleMenu = useToggleMenu(onToggleMenu || null, systemId);
  let zoneLinks;
  const machineZones = zones.filter((zone) => zone.id !== machine?.zone.id);
  if (machine?.actions.includes(NodeActions.SET_ZONE)) {
    if (machineZones.length !== 0) {
      zoneLinks = machineZones.map((zone) => ({
        children: zone.name,
        "data-testid": "change-zone-link",
        onClick: () => {
          dispatch(machineActions.setZone({ systemId, zoneId: zone.id }));
          setUpdating(zone.id);
        },
      }));
    } else {
      zoneLinks = [{ children: "No other zones available", disabled: true }];
    }
  } else {
    zoneLinks = [
      { children: "Cannot change zone of this machine", disabled: true },
    ];
  }

  useEffect(() => {
    if (updating !== null && machine?.zone.id === updating) {
      setUpdating(null);
    }
  }, [updating, machine?.zone.id]);

  if (!machine) {
    return null;
  }

  return (
    <DoubleRow
      menuLinks={onToggleMenu && zoneLinks}
      menuTitle="Change AZ:"
      onToggleMenu={toggleMenu}
      primary={
        <span data-testid="zone">
          {updating !== null ? (
            <Spinner className="u-nudge-left--small" />
          ) : null}
          <LegacyLink
            className="p-link--soft"
            route={baseURLs.zone({ id: machine.zone.id })}
          >
            {machine.zone.name}
          </LegacyLink>
        </span>
      }
      primaryTitle={machine.zone.name}
      secondary={getSpaces(machine)}
    />
  );
};

export default memo(ZoneColumn);
