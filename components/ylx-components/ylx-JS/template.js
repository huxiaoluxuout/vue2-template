import {ylxStyleObjectToString} from "@/utils/uniTools";

 const localStringStyle = (style) => {
    if (typeof style === 'string') {
        return style;
    } else {
        return ylxStyleObjectToString({
            ...style
        })
    }
};

 const componentsMixin = {
    options: {
        virtualHost: true
    },
    props: {
        customStyle: {
            type: [Object, String],
            default: () => ({})
        },
        customClass: {
            type: String,
            default: ''
        },

    }
};
export {
    ylxStyleObjectToString,
    localStringStyle,
    componentsMixin
}
