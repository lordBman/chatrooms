import { ChangeEvent, useState } from "react";

export interface TagCreateProps{
    onChange?: CallableFunction,
    values?: string[],
}

const TagsCreate: React.FC<TagCreateProps> = ({ onChange, values }) =>{
    const [initValues, setValues] = useState(values || [""]);

    const change = (index: number, event: ChangeEvent<HTMLInputElement>) =>{
        let init = [...initValues];
        init[index] = event.currentTarget.value;

        setValues(init);
        onChange && onChange(init);
    }

    const initView = (value: string, index: number) =>{
        return (
            <div key={index}>
                <label htmlFor={ `Tag ${index + 1}` }>{ `Tag ${index + 1}` }</label>
                <input id={ `Tag ${index + 1}` } onChange={ (event) => change(index, event) } value={value} type="text" placeholder="enter tag name" required />
                <button onClick={()=> remove(index) } >remove</button>
            </div>
        );
    }

    const add = () => {
        let init = [...initValues];
        init.push("");
        setValues(init);
        onChange && onChange(init);
    }

    const remove = (index: number) =>{
        if(initValues.length > 1){
            let init = [...initValues];
            init.splice(index);

            setValues(init);
            onChange && onChange(init);
        }
    }
    return (
        <div>
            { initValues.map(initView) }
            <button type="button" onClick={add} >add</button>
        </div>
    );
}

export default TagsCreate;