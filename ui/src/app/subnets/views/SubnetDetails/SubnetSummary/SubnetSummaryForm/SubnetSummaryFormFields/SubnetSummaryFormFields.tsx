import type { ChangeEventHandler } from "react";

import { Textarea, Row, Col } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { SubnetSummaryFormValues } from "../types";

import FabricSelect from "app/base/components/FabricSelect";
import FormikField from "app/base/components/FormikField";
import VLANSelect from "app/base/components/VLANSelect";
import fabricSelectors from "app/store/fabric/selectors";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import SubnetSpace from "app/subnets/views/SubnetDetails/SubnetSummary/SubnetSpace";

const SubnetSummaryFormFields = (): JSX.Element => {
  const { handleChange, setFieldValue, values } =
    useFormikContext<SubnetSummaryFormValues>();
  const fabrics = useSelector(fabricSelectors.all);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, Number(values.vlan))
  );

  const handleFabricChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    handleChange(e);
    const fabric = fabrics.find(
      (fabric) => fabric.id === Number(e.target.value)
    );
    if (fabric) {
      setFieldValue("vlan", fabric.default_vlan_id.toString());
    }
  };

  return (
    <Row>
      <Col size={6}>
        <FormikField
          label="Name"
          name="name"
          placeholder="Subnet name"
          type="text"
        />
        <FormikField
          label="CIDR"
          name="cidr"
          placeholder="1.1.1.1/24"
          type="text"
        />
        <FormikField
          label="Gateway IP"
          name="gateway_ip"
          placeholder="1.1.1.1"
          type="text"
        />
        <FormikField
          help="Space-separated list of DNS nameserver IP addresses."
          label="DNS"
          name="dns_servers"
          placeholder="1.1.1.1 2.2.2.2"
          type="text"
        />
        <FormikField
          label="Description"
          name="description"
          component={Textarea}
          placeholder="Subnet description"
        />
      </Col>
      <Col size={6}>
        <FormikField
          label="Managed allocation"
          name="managed"
          type="checkbox"
        />
        <FormikField
          label="Active discovery"
          name="active_discovery"
          type="checkbox"
        />
        <FormikField label="Proxy access" name="allow_proxy" type="checkbox" />
        <FormikField
          label="Allow DNS resolution"
          name="allow_dns"
          type="checkbox"
        />
        <FabricSelect name="fabric" onChange={handleFabricChange} />
        <VLANSelect
          fabric={Number(values.fabric)}
          name="vlan"
          showSpinnerOnLoad
        />
        <SubnetSpace spaceId={vlan?.space} />
      </Col>
    </Row>
  );
};

export default SubnetSummaryFormFields;
