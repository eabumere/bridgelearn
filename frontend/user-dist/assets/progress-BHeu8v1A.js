import{c as t}from"./index-Fy51RtrD.js";import{a as s}from"./apiClient-ctGS0Rxs.js";/**
 * @license lucide-react v0.427.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=t("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]),p={getStudentProgress:async e=>(await s.get(`/progress/student/${e}`)).data,getCourseProgress:async e=>(await s.get(`/progress/course/${e}`)).data,getAllProgress:async()=>(await s.get("/progress")).data};export{n as C,p};
