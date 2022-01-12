const LOCALSTORAGE_KEY = 'tags';

export interface TagData {
  availableTags: {
    [key: string]: Tag,
  };
  spotifyElements: {
    [key: string]: string[],
  };
}

export interface Tag {
  title: string;
  color: number;
}

export interface TagWithId extends Tag {
  id: string;
}

export default class TagsSystem {
  private static readonly DEFAULT_TAGS: TagData = {
    availableTags: {},
    spotifyElements: {},
  };

  static getTags() {
    let tags = localStorage.getItem(LOCALSTORAGE_KEY);
    if (tags === null) {
      tags = JSON.stringify(TagsSystem.DEFAULT_TAGS);
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(TagsSystem.DEFAULT_TAGS));
    }
    return JSON.parse(tags) as TagData;
  }

  private static saveTags(tags: TagData) {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(tags));
  }

  static createTag(title: string, color: number): string {
    const tags = TagsSystem.getTags();
    const newTagId = Date.now().toString();

    tags.availableTags[newTagId] = { title, color };

    TagsSystem.saveTags(tags);

    return newTagId;
  }

  static getTagById(tagId: string) {
    const tags = TagsSystem.getTags();

    return tags.availableTags[tagId] ?? null;
  }

  static editTag(tagId: string, newProps: { title?: string, color?: number }) {
    const tags = TagsSystem.getTags();

    const tag = tags.availableTags[tagId];

    const editedTag = { ...tag };
    if ( newProps.title !== undefined) editedTag.title = newProps.title;
    if ( newProps.color !== undefined) editedTag.color = newProps.color;

    tags.availableTags[tagId] = editedTag;

    TagsSystem.saveTags(tags);
  }

  static deleteTag(tagId: string) {
    const tags = TagsSystem.getTags();

    delete tags.availableTags[tagId];

    const newSpotifyElements: {
      [key: string]: string[],
    } = {};

    Object.entries(tags.spotifyElements).forEach((e) => newSpotifyElements[e[0]] = e[1].filter((id) => id !== tagId));
    tags.spotifyElements = newSpotifyElements;

    TagsSystem.saveTags(tags);
  }

  static getTagsOfElement(elementId: string) {
    const tags = TagsSystem.getTags();
    return tags.spotifyElements[elementId] ?? [];
  }

  static setTagsOfElement(elementId: string, tagIds: string[]) {
    const tags = TagsSystem.getTags();
    tags.spotifyElements[elementId] = tagIds;

    TagsSystem.saveTags(tags);
  }

  static getElementsForTag(tagId: string) {
    const tags = TagsSystem.getTags();
    return Object.entries(tags.spotifyElements).filter((e) => e[1].includes(tagId)).map((e) => e[0]) ?? [];
  }

  static addTagToElement(elementId: string, tagId: string) {
    const tags = TagsSystem.getTags();
    const currentTags = TagsSystem.getTagsOfElement(elementId);

    if (!currentTags.includes(tagId)) {
      if (currentTags.length === 0) { // possibly not defined
        tags.spotifyElements[elementId] = [];
      }
      tags.spotifyElements[elementId].push(tagId);
      TagsSystem.saveTags(tags);
    }
  }

  static removeTagFromElement(elementId: string, tagId: string) {
    const tags = TagsSystem.getTags();
    const currentTags = TagsSystem.getTagsOfElement(elementId);

    tags.spotifyElements[elementId] = currentTags.filter((tag) => tag !== tagId);

    TagsSystem.saveTags(tags);
  }
}


