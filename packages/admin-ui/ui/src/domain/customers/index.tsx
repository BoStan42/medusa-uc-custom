import { Route, Routes } from 'react-router-dom';
import Spacer from '../../components/atoms/spacer';
import RouteContainer from '../../components/extensions/route-container';
import WidgetContainer from '../../components/extensions/widget-container';
import BodyCard from '../../components/organisms/body-card';
import CustomerTable from '../../components/templates/customer-table';
import { useRoutes } from '../../providers/route-provider';
import { useWidgets } from '../../providers/widget-provider';
import Details from './details';
import CustomerGroups from './groups';
import CustomersPageTableHeader from './header';
import ExportIcon from '../../components/fundamentals/icons/export-icon';
import useToggleState from '../../hooks/use-toggle-state';
import ExportCustomersModal from './export-customers';

const CustomerIndex = () => {
  const { getWidgets } = useWidgets();

  const {
    open: openExportCustomersModal,
    close: closeExportCustomersModal,
    state: exportCustomersModalOpen,
  } = useToggleState(false);

  const actions = [
    {
      label: 'Export customers',
      onClick: () => openExportCustomersModal(),
      icon: (
        <span className="text-grey-90">
          <ExportIcon size={20} />
          {exportCustomersModalOpen && (
            <ExportCustomersModal
              title="Export customers"
              handleClose={() => closeExportCustomersModal()}
              loading={false}
            />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="gap-y-xsmall flex flex-col">
      {getWidgets('customer.list.before').map((w, index) => {
        return <WidgetContainer key={index} entity={null} widget={w} injectionZone="customer.list.before" />;
      })}

      <BodyCard
        customHeader={<CustomersPageTableHeader activeView="customers" />}
        className="h-fit"
        actionables={actions}
      >
        <CustomerTable />
      </BodyCard>

      {getWidgets('customer.list.after').map((w, index) => {
        return <WidgetContainer key={index} entity={null} widget={w} injectionZone="customer.list.after" />;
      })}
      <Spacer />
    </div>
  );
};

const Customers = () => {
  const { getNestedRoutes } = useRoutes();

  const nestedRoutes = getNestedRoutes('/customers');

  return (
    <Routes>
      <Route index element={<CustomerIndex />} />
      <Route path="/groups/*" element={<CustomerGroups />} />
      <Route path="/:id" element={<Details />} />
      {nestedRoutes.map((r, i) => {
        return <Route path={r.path} key={i} element={<RouteContainer route={r} previousPath={'/customers'} />} />;
      })}
    </Routes>
  );
};

export default Customers;
