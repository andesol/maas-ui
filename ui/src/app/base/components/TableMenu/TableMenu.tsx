import { ContextualMenu } from "@canonical/react-components";
import type { ContextualMenuProps } from "@canonical/react-components";
import classNames from "classnames";

export type Props<L = null> = {
  className?: ContextualMenuProps<L>["className"];
  disabled?: ContextualMenuProps<L>["toggleDisabled"];
  links?: ContextualMenuProps<L>["links"];
  onToggleMenu?: ContextualMenuProps<L>["onToggleMenu"];
  position?: ContextualMenuProps<L>["position"];
  positionNode?: ContextualMenuProps<L>["positionNode"];
  title?: string | null;
};

const TableMenu = <L,>({
  className,
  disabled = false,
  links,
  title,
  onToggleMenu,
  position = "left",
  positionNode,
}: Props<L>): JSX.Element => {
  // If there are no links then make it an empty array so that it can be validly spread below.
  links = links || [];
  return (
    <ContextualMenu
      className={classNames("p-table-menu", className)}
      hasToggleIcon
      links={[
        ...(title ? [title] : []),
        ...(Array.isArray(links) ? links : [links]),
      ]}
      onToggleMenu={onToggleMenu || undefined}
      position={position}
      // This shouldn't need to pass `undefined` once ContextualMenu supports null
      // See: https://github.com/canonical-web-and-design/react-components/issues/377
      positionNode={positionNode || undefined}
      toggleAppearance="base"
      toggleClassName="u-no-margin--bottom p-table-menu__toggle"
      toggleDisabled={disabled || false}
    />
  );
};

export default TableMenu;
