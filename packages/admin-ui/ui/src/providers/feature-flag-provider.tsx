import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { useAdminGetSession, useAdminStore } from "medusa-react"

export enum FeatureFlag {
  PRODUCT_CATEGORIES = "product_categories",
  INVENTORY = "inventoryService",
}

const defaultFeatureFlagContext: {
  featureToggleList: Record<string, boolean>
  isFeatureEnabled: (flag: string) => boolean
} = {
  featureToggleList: {
    analytics: false,
    opt_out: true,
    anonymize: true
  },
  isFeatureEnabled: function (flag): boolean {

    if(flag == 'analytics')
      return false;
    else if(flag == 'opt_out')
      return true;
    else if(flag == 'anonymize')
      return true;

    return !!this.featureToggleList[flag]
  },
}

const FeatureFlagContext = React.createContext(defaultFeatureFlagContext)

export const FeatureFlagProvider = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAdminGetSession()

  const [featureFlags, setFeatureFlags] = useState<
    { key: string; value: boolean }[]
  >([])

  const { store, isFetching } = useAdminStore()

  useEffect(() => {
    if (
      isFetching ||
      !store ||
      (!user && !isLoading) ||
      !store["feature_flags"]?.length
    ) {
      return
    }

    setFeatureFlags([
      ...store["feature_flags"],
      ...store["modules"].map((module) => ({
        key: module.module,
        value: true,
      })),
    ])
  }, [isFetching, store, user, isLoading])

  const featureToggleList = featureFlags.reduce(
    (acc, flag) => ({ ...acc, [flag.key]: flag.value }),
    {} as Record<string, boolean>
  )

  const isFeatureEnabled = (flag: string) => {

    if(flag == 'analytics')
      return false;
    else if(flag == 'opt_out')
      return true;
    else if(flag == 'anonymize')
      return true;
    
    return !!featureToggleList[flag];
  }

  return (
    <FeatureFlagContext.Provider
      value={{ isFeatureEnabled, featureToggleList }}
    >
      {children}
    </FeatureFlagContext.Provider>
  )
}

export const useFeatureFlag = () => {
  const context = useContext(FeatureFlagContext)

  if (!context) {
    throw new Error("useFeatureFlag must be used within a FeatureFlagProvider")
  }

  return context
}
