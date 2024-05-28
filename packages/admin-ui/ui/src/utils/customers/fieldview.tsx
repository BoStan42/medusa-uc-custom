type FieldViewType = {
    title: string,
    full?: boolean,
    children?: any,
}

const FieldView = ({title, full, children}: FieldViewType) => {

    return(
        <div className={"flex flex-col items-start flex-wrap" + (full ? " col-span-2" : "")}>
            <div className="text-gray-500 text-xs">{title}:</div>
            <div className="break-all">{children}</div>
        </div>
    );

}

export default FieldView;