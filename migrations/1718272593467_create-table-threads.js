exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'CHARACTER VARYING(50)',
      primaryKey: true,
    },
    title: {
      type: 'CHARACTER VARYING(255)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'CHARACTER VARYING(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};