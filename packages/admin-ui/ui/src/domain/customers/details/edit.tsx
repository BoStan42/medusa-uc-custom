import { Customer } from "@medusajs/medusa"
import { useAdminUpdateCustomer } from "medusa-react"
import { useEffect } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../components/fundamentals/button"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import InputField from "../../../components/molecules/input"
import TextArea from "../../../components/molecules/textarea"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { validateEmail } from "../../../utils/validate-email"
import getCustomerFields, { customersTypes } from "../../../utils/customers/getcustomerfields"
import Select from "../../../components/molecules/select/next-select/select"

type EditCustomerModalProps = {
  customer: Customer
  refetchCustomer: () => void
  handleClose: () => void
}

type EditCustomerFormType = {
  first_name: string
  last_name: string
  email: string
  phone: string | null
  metadata: any
}

const EditCustomerModal = ({
  handleClose,
  customer,
  refetchCustomer,
}: EditCustomerModalProps) => {
  const { t } = useTranslation()

  const form = useForm<EditCustomerFormType>({
    defaultValues: getDefaultValues(customer),
  })

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty },
    control,
  } = form

  const notification = useNotification()

  const updateCustomer = useAdminUpdateCustomer(customer.id)

  const customerType = useWatch({control: control, name: "metadata.type"});
  
  const onSubmit = handleSubmit((data) => {

    // Customer type
    
    data.metadata.type = data?.metadata?.type?.value ?? "";
    
    // Clear metadata fields for customer

    if(!data.metadata.type) {
      for(const f of getCustomerFields({metadata: data?.metadata} as Customer)) {
        if(!['type', 'description'].includes(f.id)) {
          data.metadata[f.id] = "";
        }
      }
    }

    updateCustomer.mutate(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        // @ts-ignore
        phone: data.phone,
        email: data.email,
        metadata: {...data.metadata, },
      },
      {
        onSuccess: () => {
          handleClose()
          refetchCustomer()
          notification(
            t("details-success", "Success"),
            t(
              "details-successfully-updated-customer",
              "Successfully updated customer"
            ),
            "success"
          )
        },
        onError: (err) => {
          handleClose()
          notification(
            t("details-error", "Error"),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  })

  useEffect(() => {
    reset(getDefaultValues(customer))
  }, [customer])
  
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {t("details-customer-details", "Customer Details")}
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="gap-y-6 flex flex-col">
            <div>
              <h2 className="inter-base-semibold text-grey-90 mb-4">
                {t("details-general", "General")}
              </h2>
              <div className="flex w-full space-x-2">
                <InputField
                  label={t("details-first-name", "First Name")}
                  {...register("first_name")}
                  placeholder={t("details-lebron", "Lebron")}
                />
                <InputField
                  label={t("details-last-name", "Last Name")}
                  {...register("last_name")}
                  placeholder={t("details-james", "James")}
                />
              </div>
            </div>
            <div>
              <h2 className="inter-base-semibold text-grey-90 mb-4">Contact</h2>
              <div className="flex space-x-2">
                <InputField
                  label={t("details-email", "Email")}
                  {...register("email", {
                    validate: (value) => !!validateEmail(value),
                    disabled: customer.has_account,
                  })}
                  prefix={
                    customer.has_account && (
                      <LockIcon size={16} className="text-grey-50" />
                    )
                  }
                  disabled={customer.has_account}
                />
                <InputField
                  label={t("details-phone-number", "Phone number")}
                  {...register("phone")}
                  placeholder="+45 42 42 42 42"
                />
              </div>
            </div>
            <div>
              <h2 className="inter-base-semibold text-grey-90 mb-4">
                Additional
              </h2>
              <div className="flex space-x-2">
                <Controller
                  control={control}
                  {...register("metadata.type")}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        label="Customer type on register"
                        placeholder={"Customer type on register"}
                        value={value}
                        isMulti={false}
                        onChange={onChange}
                        options={customersTypes || []}
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex space-x-2">
                <TextArea
                  label="Description"
                  {...register("metadata.description")}
                  placeholder="Description"
                  className="w-full"
                  rows={4}
                />
              </div>
            </div>
            {!!customerType?.value && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <InputField
                    label="Company"
                    {...register("metadata.company")}
                    placeholder=""
                  />
                  <InputField
                    label="Website"
                    {...register("metadata.website")}
                    placeholder=""
                  />
                </div>
                <div>
                  <h2 className="inter-base-semibold text-grey-90 mb-4">
                    Reseller
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Tax exempt number"
                      {...register("metadata.exempt_number")}
                      placeholder=""
                    />
                  </div>
                </div>
                <div>
                  <h2 className="inter-base-semibold text-grey-90 mb-4">
                    Installer
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Ability to travel to customer site, km"
                      {...register("metadata.installer_distance")}
                      placeholder=""
                      type="number"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="secondary"
              size="small"
              onClick={handleClose}
              className="mr-2"
              type="button"
            >
              {t("details-cancel", "Cancel")}
            </Button>
            <Button
              loading={updateCustomer.isLoading}
              disabled={!isDirty || updateCustomer.isLoading}
              variant="primary"
              size="small"
              onClick={onSubmit}
            >
              {t("details-save-and-close", "Save and close")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (customer: Customer): EditCustomerFormType => {
  return {
    first_name: customer.first_name,
    email: customer.email,
    last_name: customer.last_name,
    phone: customer.phone,
    metadata: {...customer.metadata, type: customersTypes.find(v=>v.value === (customer.metadata?.type ?? ""))},
  }
}

export default EditCustomerModal
