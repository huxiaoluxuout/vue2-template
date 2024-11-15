
// import ylxIntercept from "@/.yalc/ylxuni/index.js"
import {EventBusCore} from "@/.yalc/ylxuni/src/EventBusCore";
export const instanceEventBus = new EventBusCore()


import ylxIntercept from "@/ylxuniCore/ylxuni.esm.js"

const ylxInstance = ylxIntercept()


export const ylxNextPage = ylxInstance.ylxNextPage.useNextPage
export const { ylxEventBus, ylxMustLogIn } = ylxInstance

