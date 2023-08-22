// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { modules } from "../../../../../utils/moduleRights";

// Validation schema  表单校验
const ProductEditSchema = Yup.object().shape({
  rolename: Yup.string().required("role name is required"),
});

export function ProductEditForm({ product, btnRef, saveProduct, btnResRef, id, actionsLoading }) {
  let [accessModules, setAccessModule] = useState([]);
  const [initProduct, setInitProduct] = useState({
    rolename: "",
  });

  let updateModulePermission = (module, permission) => {
    let changeModuleAccess = accessModules.map((item) => {
      if (item.code == module) {
        if (item[permission]) {
          item[permission] = false
        } else {
          item[permission] = true
        }
      }
      return item
    })
    setAccessModule(changeModuleAccess)
  };

  function checkUnCheckAll(flag, permission, field_name) {
    let changeModuleAccess = accessModules.map((item) => {
      if (item[field_name]) {
        item[permission] = flag 
      }
      return item
    })
    setAccessModule(changeModuleAccess)
  }

  function getPermission(module, permission) {
    if (product.rights) {
      let module_permission = product.rights.filter((item) => {
        if (item.code == module) {
          return item
        }
      })
      if (module_permission && module_permission[0]) {
        return module_permission[0][permission]
      } else {
        return false
      }
    } else {
      return false
    }
  }

  useEffect(() => {
    if (id) {
      setInitProduct({ rolename: product.rolename, _id: product._id })
      let moduleAccess = modules.map((item) => {
        item.can_read = getPermission(item.code, 'can_read')
        item.can_add = getPermission(item.code, 'can_add')
        item.can_edit = getPermission(item.code, 'can_edit')
        item.can_delete = getPermission(item.code, 'can_delete')
        item.can_approval = getPermission(item.code, 'can_approval')
        item.can_confirm = getPermission(item.code, 'can_confirm')
        return item
      })
      setAccessModule(moduleAccess)
    } else {
      let moduleAccess = modules.map((item) => {
        item.can_read = false
        item.can_add = false
        item.can_edit = false
        item.can_delete = false
        item.can_approval = false
        item.can_confirm = false
        return item
      })
      setAccessModule(moduleAccess)
    }
  }, [actionsLoading])
  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initProduct}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          let tempData = [...accessModules]
          let rights = []
          tempData.filter((item) => {
            rights.push({
              code: item.code,
              can_add: item.can_add,
              can_approval: item.can_approval,
              can_confirm: item.can_confirm,
              can_delete: item.can_delete,
              can_edit: item.can_edit,
              can_read: item.can_read
            })
          })
          values.rights = rights
          saveProduct(values);
        }}
      >
        {({ handleSubmit, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group">
                <label><b>Role Name</b> <span className="indicatory">*</span></label>
                <Field
                  withFeedbackLabel={false}
                  name="rolename"
                  component={Input}
                  placeholder="role name"
                />
              </div>
              <div>
                <div>
                  <label><b>Role Permissions</b></label>
                </div>
                <div className="flex">
                  <table className="table table-head-custom table-vertical-center table-head-bg">
                    <thead>
                      <tr className="text-left">
                        <th>Module Name</th>
                        <th className="text-center">
                          Read <br />
                          <input
                            type="checkbox"
                            onInput={(e) => checkUnCheckAll(e.target.checked, 'can_read', 'read')}
                          />
                        </th>
                        <th className="text-center">
                          Add<br />
                          <input
                            type="checkbox"
                            onInput={(e) => checkUnCheckAll(e.target.checked, 'can_add', 'add')}
                          />
                        </th>
                        <th className="text-center">
                          Edit<br />
                          <input
                            type="checkbox"
                            onInput={(e) => checkUnCheckAll(e.target.checked, 'can_edit', 'edit')}
                          />
                        </th>
                        <th className="text-center">
                          Delete<br />
                          <input
                            type="checkbox"
                            onInput={(e) => checkUnCheckAll(e.target.checked, 'can_delete', 'delete')}
                          />
                        </th>
                        <th className="text-center">
                          Approval<br />
                          <input
                            type="checkbox"
                            onInput={(e) => checkUnCheckAll(e.target.checked, 'can_approval', 'approve_reject')}
                          />
                        </th>
                        <th className="text-center">
                          Confirm<br />
                          <input
                            type="checkbox"
                            onInput={(e) => checkUnCheckAll(e.target.checked, 'can_confirm', 'confirm')}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessModules &&
                        accessModules.map((module, i) => (
                          <tr key={i}>
                            <td>{module.name}</td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={!module.read}
                                onInput={() => updateModulePermission(module.code, 'can_read')}
                                checked={module.can_read}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={!module.add}
                                onInput={() => updateModulePermission(module.code, 'can_add')}
                                checked={module.can_add}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={!module.edit}
                                onInput={() => updateModulePermission(module.code, 'can_edit')}
                                checked={module.can_edit}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={!module.delete}
                                onInput={() => updateModulePermission(module.code, 'can_delete')}
                                checked={module.can_delete}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={!module.approve_reject}
                                onInput={() => updateModulePermission(module.code, 'can_approval')}
                                checked={module.can_approval}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                disabled={!module.confirm}
                                onInput={() => updateModulePermission(module.code, 'can_confirm')}
                                checked={module.can_confirm}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
