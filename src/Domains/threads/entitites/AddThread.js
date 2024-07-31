class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verifyPayload({ title, body }) {
   if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 100) {
      throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
    }

    if (!RegExp(/^[\w\s]+$/).exec(title)) {
      throw new Error('ADD_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = AddThread;