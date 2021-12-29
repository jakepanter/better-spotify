import React, {useRef, useState} from "react";
import "./SettingsPage.scss";
import Dialog from "../../components/Dialog/Dialog";

function SettingsPage() {
  // TODO: will be implemented by TagSystem
  const { availableTags }: {availableTags: {[key: string]: {title: string, color: number} }} = {
    availableTags: {
      someTagId: {title: 'Tag Title', color: 0},
      anotherTagId: {title: 'Another Tag Title', color: 3},
    }
  };

  const [showDialogAddTag, setShowDialogAddTag] = useState<boolean>(false);
  const [showDialogEditTag, setShowDialogEditTag] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const addTagTitle: React.RefObject<HTMLInputElement> = useRef(null);
  const addTagColor = useRef(null);
  const editTagTitle: React.RefObject<HTMLInputElement> = useRef(null);
  const [editTagTitleValue, setEditTagTitleValue] = useState<string>('');
  const editTagColor = useRef(null);
  const [editTagColorValue, setEditTagColorValue] = useState<number>(0);

  const addTag = () => {
    // TODO: Call TagSystem function
    // TagSystem.addTag(addTagTitle.current.value, addTagColor.current.value);

    setShowDialogAddTag(false);
  }

  const openEditTag = () => {
    console.log(selectedTag);
    setEditTagTitleValue(availableTags[selectedTag].title);
    setEditTagColorValue(availableTags[selectedTag].color)

    setShowDialogEditTag(true);
  }

  const saveEditTag = () => {
    // TODO: Call TagSystem function

    setShowDialogEditTag(false);
  };

  const deleteTag = () => {
    // TODO: Call TagSystem function
    // TagSystem.deleteTag(selectedTag);
    console.log(selectedTag);
  }

  return <div className={'Settings'}>
    <div className={'SettingsSection SettingsSectionTags'}>
      <h2 className={'SettingsSectionHeading'}>Tags</h2>
      <div className={'SettingsSectionRow'}>
        <div>
          <div className={'SettingsSection'}>
            <select className={'TagList'}
                    size={5}
                    onChange={(e) => setSelectedTag(e.currentTarget.value)}
            >
              {Object.entries(availableTags).map((tag) => (
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
                      onClick={() => setShowDialogAddTag(true)}
                      title={'Add New Tag'}
              >
                <span className={'material-icons'}>add</span>
              </button>
              <button className={'button'}
                      onClick={() => openEditTag()}
                      title={'Edit Selected Tag'}
              >
                <span className={'material-icons'}>edit</span>
              </button>
              <button className={'button'}
                      onClick={() => deleteTag()}
                      title={'Delete Selected Tag'}
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
              />
            </label>
            <label className={'Label'}>
              Color
              <select className={'input-select'} ref={addTagColor}>
                <option className={'TagColor TagColor0'} value={0}/>
                <option className={'TagColor TagColor1'} value={1}/>
                <option className={'TagColor TagColor2'} value={2}/>
                <option className={'TagColor TagColor3'} value={3}/>
                <option className={'TagColor TagColor4'} value={4}/>
                <option className={'TagColor TagColor5'} value={5}/>
              </select>
            </label>
            <button className={'button'} onClick={() => addTag()}>
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
              />
            </label>
            <label className={'Label'}>
              Color
              <select className={'input-select'}
                      ref={editTagColor}
                      value={editTagColorValue}
              >
                <option className={'TagColor TagColor0'} value={0}/>
                <option className={'TagColor TagColor1'} value={1}/>
                <option className={'TagColor TagColor2'} value={2}/>
                <option className={'TagColor TagColor3'} value={3}/>
                <option className={'TagColor TagColor4'} value={4}/>
                <option className={'TagColor TagColor5'} value={5}/>
              </select>
            </label>
            <button className={'button'} onClick={() => saveEditTag()}>
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
