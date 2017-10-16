/*
* @Author: zhouningyi
* @Date: 2016-10-29 20:01:17
*/
import {fade, emphasize} from 'material-ui/utils/colorManipulator';
export default function getStyles(props, state, context){
  const { palette } = context.muiTheme;
  const backgroundColor = palette.background1Color;
  const {primary1Color, shadowColor}   = palette;
  const gridW = 36;
  const padding = gridW / 2;
  const background = 'rgba(0, 0, 0, 0.0)';
  const fontColor = '#fff';
  const textNormalColor = emphasize(backgroundColor, 0.9);
  const iconStyle = state.isAddingLayer ? { backgroundColor } : {} ;
  const lineO = {
    position: 'relative',
    transition: '0.2s',
    margin: '1px 0',
    overflow: 'hidden',
    height: `${gridW}px`,
    width: '100%',
    lineHeight: `${gridW}px`,
  };
  const iconO = {
    position: 'relative',
    display: 'inline-block',
    height: `${gridW}px`,
    lineHeight: `${gridW}px`,
    textAlign: 'center',
    width:  `${gridW}px`,
    color: fontColor,
    fontSize: '24px',
    background,
    overflow: 'hidden'
  };
  const textO = {
    position: 'relative',
    display: 'inline-block',
    height: `${gridW}px`,
    lineHeight: `${gridW}px`,
    textAlign: 'left',
    color: fontColor,
    verticalAlign: 'top',
    overflow: 'hidden',
    paddingLeft: `${padding}px`
  };
  const full = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  };
  return {
    mapContainer: {...full,
      zIndex: 1
    },
    uiContainer: {...full, 
      pointerEvents: 'none',
      zIndex: 2,
      display: props.isShow ? null : 'none'
    },
    main: {
      width: '192px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor,
      pointerEvents: 'auto',
      boxShadow: `2px 2px 3px ${fade(shadowColor, 0.5)}`
    },
    header: Object.assign({}, lineO, {
      width: `calc(100% - ${(0)}px)`,
      // paddingLeft: `${padding}px`,
      textAlign: 'left',
      height: '30px',
      backgroundColor: emphasize(backgroundColor, 0.05),
      cursor:'pointer',
      color: textNormalColor,
      position: 'relative',
      overflow: 'hidden',
      userSelect:'none',
      display: 'flex',
      flexDirection: 'row',
      padding: '3px',
      alignItems: 'center',
    }),
    headerText: Object.assign({}, textO, {
      width:  `calc(100% - ${(gridW + padding)}px)`,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      color: textNormalColor,
      flexGrow: 1,
      fontSize: '14px',
    }),
    layer: Object.assign({}, lineO, {
      textAlign: 'center',
      backgroundColor: emphasize(backgroundColor, 0.05),
      cursor:'pointer',
      color: textNormalColor,
      userSelect:'none'
    }),
    layerHoverStyle: {
      color: textNormalColor,
      backgroundColor: emphasize(backgroundColor, 0.1),
    },
    layerSelected: {
      border: '2px solid ' + primary1Color,
      padding: '0 10px',
    },
    layerText: Object.assign({}, textO, {
      width:  `calc(100% - ${(gridW + 48 + padding)}px)`,
      color: textNormalColor,
      flexGrow: 1,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      padding: 0,
    }),
    layerBoolean: {
      position: 'relative',
      display: 'inline-block',
      height: `${gridW}px`,
      lineHeight: `${gridW}px`,
      width:  `${48}px`,
      background,
      verticalAlign: 'center'
    },
    toggle: {
      top: `${(gridW - 24) / 2}px`,
    },
    headerLayerIcon: { 
      ...iconO,
      color: textNormalColor,
      ...iconStyle,
      height: '20px',
      width: '20px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
    },
    layerIcon: {
      ...iconO,
      color: textNormalColor,
      cursor: 'pointer',
      padding: 0,
      fontSize: '12px',
      width: 'initial',
      height: 'initial',
      lineHeight: 'initial',
    },
    layerIconMore: {
      height: `${gridW}px`,
      width:  `${gridW * 0.6}px`,
      color: fontColor,
    },
    subMenu: Object.assign({}, lineO, {
      backgroundColor: emphasize(backgroundColor, 0.05),
    })
  };
};
