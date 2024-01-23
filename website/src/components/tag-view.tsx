import { Tag } from "../utils/response";

export interface TagViewProps{
    tag: Tag
}

const TagView: React.FC<TagViewProps> = ({ tag }) =>{
    return (
        <label style={{ margin: 10 }}>{tag.name}</label>
    );
}

export default TagView;