exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments('id');
      table.string('email');
      table.string('password');
      table.string('first_name');
      table.string('last_name');
    })
  ])
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
