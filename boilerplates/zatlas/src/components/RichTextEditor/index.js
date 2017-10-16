/**
 * @Author: mark
 * @Date:   2017-06-23T13:52:28+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: index.js
 * @Last modified by:   mark
 * @Last modified time: 2017-08-29T14:23:25+08:00
 * @License: MIT
 */

 import React, { PureComponent, PropTypes } from 'react';
 import ReactQuill, { Quill } from 'react-quill';
 import 'react-quill/dist/quill.core.css';
 import 'react-quill/dist/quill.snow.css';
 import styles from './index.css';

 const CustomToolbar = () => (
   <div id="toolbar" style={{ backgroundColor: '#FFF' }} >
     <select className="ql-font">
       <option defaultValue />
       <option value="serif" />
       <option value="monospace" />
     </select>
     <select className="ql-size">
       <option defaultValue>12px</option>
       <option value="14px">14px</option>
       <option value="18px">18px</option>
       <option value="20px">20px</option>
       <option value="24px">24px</option>
       <option value="36px">36px</option>
     </select>
     <button className="ql-bold" />
     <button className="ql-italic" />
     <button className="ql-underline" />
     <button className="ql-strike" />
     <button className="ql-blockquote" />
     <select className="ql-color" />
     <select className="ql-background" />
     <button className="ql-list" value="ordered" />
     <button className="ql-list" value="bullet" />
     <select className="ql-align" />
     <button className="ql-link" />
     <button className="ql-image" />
   </div>
  );

 const customModules = {
   clipboard: {
     matchVisual: false,
   },
   toolbar: {
     container: '#toolbar',
   },
 };

 export default class RichTextEditor extends PureComponent {
   static propTypes = {
     activePlane: PropTypes.string,
     id: PropTypes.string,
   }

   static defaultProps = {
     activePlane: undefined,
     id: '',
   }

   constructor(props) {
     super(props);
     this.state = { text: '' };
     this.handleChange = this.handleChange.bind(this);
     const SizeStyle = Quill.import('attributors/style/size');
     SizeStyle.whitelist = [false, '12px', '14px', '18px', '20px', '24px', '36px'];
     Quill.register(SizeStyle, true);
   }

   componentWillReceiveProps(nextProps) {
     if (nextProps.data) {
       this.setState({ text: nextProps.data });
     }
   }
   handleChange(value) {
     this.setState({ text: value });
     this.props.onFinalData && this.props.onFinalData(this.state.text);
   }

   render() {
     return (
       <div className={styles.container}>
         {
           this.props.activePlane && this.props.id && this.props.activePlane === this.props.id ?
             <div style={{ height: '100%' }}>
               <CustomToolbar />
               <ReactQuill
                 modules={customModules}
                 value={this.state.text}
                 onChange={this.handleChange}
                 placeholder={'请输入文本'}
               />
             </div> :
             <div
               className={styles.txtcontainer}
               dangerouslySetInnerHTML={{ __html: this.state.text }}
             />
         }
       </div>
     );
   }
 }
