/**
* @Author: eason
* @Date:   2016-12-05T13:59:11+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   inverse
* @Last modified time: 2016-12-12T18:10:51+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

import React from 'react';

import TableList from './TableList'; // only show, none filters
import PlainList from './PlainList'; // TableList + filters
import CheckboxList from './CheckboxList'; // PlainList + selectAll
import ProgressList from './ProgressList'; // PlainList + progress in column

const CommonList = ({type="plain", ...others}) => {
  switch (type) {
    case 'checkbox':
      return <CheckboxList {...others} />;
    case 'table':
      return <TableList {...others} />;
    case 'progress':
      return <ProgressList {...others}></ProgressList>
    default:
      return <PlainList {...others} />
  }
};

export default CommonList;
