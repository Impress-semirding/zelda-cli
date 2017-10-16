/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/

import factory      from './../../../lib/factory';
import BaseLayer from './../../../lib/BaseLayer';
import BoundL from './bound';


class Bound extends BaseLayer {
  constructor(props){
    super(props, BoundL, BoundL.options);
  }
  static defaultProps = {
    onChange: () => {}
  }
  static getOptions = () => {
    return BoundL.options;
  }
  _initEvents(){
    this.layer
      .on('select', this.onSelect)
  }
  onSelect = (bound) => {
    this.props.onChange({
      type: 'datafilter',
      value: bound
    });
  }
};


export default Bound;
