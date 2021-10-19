// import { convertEditorStateToDbData } from './dataConverter';
import {
    createEditorStateFromRaw,
    serialiseEditorStateToRaw,
} from 'draftjs-conductor'

export default function HtmlCell({ data }) {
    return JSON.stringify(data)
}
