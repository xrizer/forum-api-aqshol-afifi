exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'CHARACTER VARYING(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'CHARACTER VARYING(50)',
      notNull: true,
      references: '"threads"',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'CHARACTER VARYING(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};