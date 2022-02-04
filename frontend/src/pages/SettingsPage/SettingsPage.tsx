import React, {useRef, useState} from "react";
import "./SettingsPage.scss";
import Dialog from "../../components/Dialog/Dialog";
import TagsSystem, {TagData} from "../../utils/tags-system";

function SettingsPage() {
  const [tags, setTags] = useState<TagData>(TagsSystem.getTags());

  const [showDialogAddTag, setShowDialogAddTag] = useState<boolean>(false);
  const [showDialogEditTag, setShowDialogEditTag] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const addTagTitle: React.RefObject<HTMLInputElement> = useRef(null);
  const [addTagTitleValue, setAddTagTitleValue] = useState<string>('');
  const addTagColor: React.RefObject<HTMLSelectElement> = useRef(null);
  const [addTagColorValue, setAddTagColorValue] = useState<number>(0);
  const editTagTitle: React.RefObject<HTMLInputElement> = useRef(null);
  const [editTagTitleValue, setEditTagTitleValue] = useState<string>('');
  const editTagColor: React.RefObject<HTMLSelectElement> = useRef(null);
  const [editTagColorValue, setEditTagColorValue] = useState<number>(0);

  const openAddTag = () => {
    setAddTagTitleValue('');
    setAddTagColorValue(0);
    setShowDialogAddTag(true);
  }

  const addTag = (title: string, color: number) => {
    if (addTagTitle.current !== null && addTagColor.current !== null && title !== '') {
      TagsSystem.createTag(title, color);
      setTags(TagsSystem.getTags());
      setShowDialogAddTag(false);
    }
  }

  const openEditTag = () => {
    if (selectedTag !== '') {
      setEditTagTitleValue(tags.availableTags[selectedTag].title);
      setEditTagColorValue(tags.availableTags[selectedTag].color);
      setShowDialogEditTag(true);
    }
  }

  const saveEditTag = (title: string, color: number) => {
    if (title === '') return;

    TagsSystem.editTag(selectedTag, {
      title,
      color,
    });

    setTags(TagsSystem.getTags());
    setShowDialogEditTag(false);
  };

  const deleteTag = () => {
    TagsSystem.deleteTag(selectedTag);

    setTags(TagsSystem.getTags());
    setSelectedTag('');
  }

  return <div className={'Settings'}>
    <div className={'SettingsSection SettingsSectionTags'}>
      <h2 className={'SettingsSectionHeading'}>Tags</h2>
      <div className={'SettingsSectionRow'}>
        <div>
          <div className={'SettingsSection'}>
            <select className={'TagList'}
                    size={5}
                    onChange={(e) => setSelectedTag(e.target.value)}
            >
              {Object.entries(tags.availableTags).map((tag) => (
                <option key={tag[0]}
                        className={`TagColor TagColor${tag[1].color}`}
                        value={tag[0]}
                >
                  {tag[1].title}
                </option>)
              )}
            </select>
            <div className={'SpacingTop'}>
              <button className={'button'}
                      onClick={() => openAddTag()}
                      title={'Add New Tag'}
              >
                <span className={'material-icons'}>add</span>
              </button>
              <button className={'button'}
                      onClick={() => openEditTag()}
                      title={'Edit Selected Tag'}
                      disabled={selectedTag === ''}
              >
                <span className={'material-icons'}>edit</span>
              </button>
              <button className={'button'}
                      onClick={() => deleteTag()}
                      title={'Delete Selected Tag'}
                      disabled={selectedTag === ''}
              >
                <span className={'material-icons'}>delete</span>
              </button>
            </div>
          </div>

          {/* Dialogs */}
          <Dialog title={'Add Tag'} open={showDialogAddTag} onClose={() => setShowDialogAddTag(false)}>
            <label className={'Label'}>
              Title
              <input type={'text'}
                     className={'input'}
                     ref={addTagTitle}
                     value={addTagTitleValue}
                     onChange={(e) => setAddTagTitleValue(e.target.value)}
                     required={true}
              />
            </label>
            <label className={'Label'}>
              Color
              <select className={'TagList'}
                      ref={addTagColor}
                      size={6}
                      value={addTagColorValue}
                      onChange={(e) => setAddTagColorValue(Number(e.target.value))}
              >
                <option className={'TagColor TagColor0'} value={0}/>
                <option className={'TagColor TagColor1'} value={1}/>
                <option className={'TagColor TagColor2'} value={2}/>
                <option className={'TagColor TagColor3'} value={3}/>
                <option className={'TagColor TagColor4'} value={4}/>
                <option className={'TagColor TagColor5'} value={5}/>
              </select>
            </label>
            <button className={'button'}
                    onClick={() => addTag(addTagTitleValue, addTagColorValue)}
                    disabled={addTagTitleValue === ''}
            >
              <span className={'material-icons'}>add</span>
              Add
            </button>
          </Dialog>

          <Dialog title={'Edit Tag'} open={showDialogEditTag} onClose={() => setShowDialogEditTag(false)}>
            <label className={'Label'}>
              Title
              <input type={'text'}
                     className={'input'}
                     ref={editTagTitle}
                     value={editTagTitleValue}
                     onChange={(e) => setEditTagTitleValue(e.target.value)}
                     required={true}
              />
            </label>
            <label className={'Label'}>
              Color
              <select className={'TagList'}
                      ref={editTagColor}
                      value={editTagColorValue}
                      size={6}
                      onChange={(e) => setEditTagColorValue(Number(e.target.value))}
              >
                <option className={'TagColor TagColor0'} value={0}/>
                <option className={'TagColor TagColor1'} value={1}/>
                <option className={'TagColor TagColor2'} value={2}/>
                <option className={'TagColor TagColor3'} value={3}/>
                <option className={'TagColor TagColor4'} value={4}/>
                <option className={'TagColor TagColor5'} value={5}/>
              </select>
            </label>
            <button className={'button'}
                    onClick={() => saveEditTag(editTagTitleValue, editTagColorValue)}
                    disabled={editTagTitleValue === ''}
            >
              <span className={'material-icons'}>save</span>
              Save
            </button>
          </Dialog>
        </div>
      </div>
    </div>
  </div>;
}

export default SettingsPage;
