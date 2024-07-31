exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'CHARACTER VARYING(50)',
      primaryKey: true,
    },
    username: {
      type: 'CHARACTER VARYING(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};