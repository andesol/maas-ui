import { Spinner } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { token as tokenActions } from "app/preferences/actions";
import { token as tokenSelectors } from "app/preferences/selectors";
import APIKeyForm from "../APIKeyForm";

export const APIKeyEdit = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(tokenActions.fetch());
  }, [dispatch]);

  const { id } = useParams();
  const loading = useSelector(tokenSelectors.loading);
  const token = useSelector((state) =>
    tokenSelectors.getById(state, parseInt(id))
  );
  if (loading) {
    return <Spinner text="Loading..." />;
  }
  if (!token) {
    return <h4>API key not found</h4>;
  }
  return <APIKeyForm token={token} />;
};

export default APIKeyEdit;
