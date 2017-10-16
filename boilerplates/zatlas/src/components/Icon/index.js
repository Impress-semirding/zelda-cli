import React from 'react';
import classnames from 'classnames';

export default function Icon({ name, className, onClick, style, title, refs }) {
  const cls = classnames({
    elfen: true,
    [`elfen-${name}`]: true,
    [className]: true,
  });
  return (
    <i data-role="icon" className={cls} ref={(r) => { refs && refs(r); }} onClick={() => { onClick && onClick(); }} style={style} title={title} />
  );
}
