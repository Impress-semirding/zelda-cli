import { connect } from 've-react-databinding';
import MapComponent from '../../components/public/Map';


const transform = (data, types, feedings) => {
  return { data, types, feedings};
}

function wrapper (Chart) {
  const { defaultProps } = Chart;
  const {validation, options, binding, comType='component'} = defaultProps;
  const displayName = Chart.name === MapComponent.name ? '地图' : defaultProps.name_cn || name;
  const type = Chart.name === MapComponent.name ? 'Map' : Chart.componentName;
  if (binding) {
    Chart = connect(binding, transform)(Chart);
  }
  return {
    component: Chart,
    name: displayName,
    icon: 'map',
    options,
    validation,
    binding,
    comType,
    type
  };
}

export default {
  wrapper
};
