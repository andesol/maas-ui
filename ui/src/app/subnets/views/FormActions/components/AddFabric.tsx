import { Row, Col, Input } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import type { FormActionProps } from "../FormActions";

import FormikField from "app/base/components/FormikField";
import FormikForm from "app/base/components/FormikForm";
import { actions as fabricActions } from "app/store/fabric";
import fabricSelectors from "app/store/fabric/selectors";

type AddFabricValues = {
  name: string;
  description: string;
};

const AddFabric = ({
  activeForm,
  setActiveForm,
}: FormActionProps): JSX.Element => {
  const dispatch = useDispatch();
  const isSaving = useSelector(fabricSelectors.saving);
  const isSaved = useSelector(fabricSelectors.saved);
  const errors = useSelector(fabricSelectors.errors);

  return (
    <FormikForm<AddFabricValues>
      aria-label="Add fabric"
      buttonsBordered={false}
      allowAllEmpty
      initialValues={{ name: "", description: "" }}
      onSaveAnalytics={{
        action: "Add fabric",
        category: "Subnets form actions",
        label: "Add fabric",
      }}
      submitLabel={`Add ${activeForm}`}
      onSubmit={({ name, description }) => {
        dispatch(fabricActions.create({ name, description }));
      }}
      onCancel={() => setActiveForm(null)}
      onSuccess={() => setActiveForm(null)}
      saving={isSaving}
      saved={isSaved}
      errors={errors}
    >
      <Row>
        <Col size={6}>
          <FormikField
            takeFocus
            type="text"
            name="name"
            component={Input}
            disabled={isSaving}
            label="Name (optional)"
          />
        </Col>
        <Col size={6}>
          <FormikField
            type="text"
            name="description"
            component={Input}
            disabled={isSaving}
            label="Description (optional)"
          />
        </Col>
      </Row>
    </FormikForm>
  );
};

export default AddFabric;
