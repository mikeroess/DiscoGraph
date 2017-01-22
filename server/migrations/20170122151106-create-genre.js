'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Genres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      1950: {
        type: Sequelize.INTEGER
      },
      1951: {
        type: Sequelize.INTEGER
      },
      1952: {
        type: Sequelize.INTEGER
      },
      1953: {
        type: Sequelize.INTEGER
      },
      1954: {
        type: Sequelize.INTEGER
      },
      1955: {
        type: Sequelize.INTEGER
      },
      1956: {
        type: Sequelize.INTEGER
      },
      1957: {
        type: Sequelize.INTEGER
      },
      1958: {
        type: Sequelize.INTEGER
      },
      1959: {
        type: Sequelize.INTEGER
      },
      1960: {
        type: Sequelize.INTEGER
      },
      1961: {
        type: Sequelize.INTEGER
      },
      1962: {
        type: Sequelize.INTEGER
      },
      1963: {
        type: Sequelize.INTEGER
      },
      1964: {
        type: Sequelize.INTEGER
      },
      1965: {
        type: Sequelize.INTEGER
      },
      1966: {
        type: Sequelize.INTEGER
      },
      1967: {
        type: Sequelize.INTEGER
      },
      1968: {
        type: Sequelize.INTEGER
      },
      1969: {
        type: Sequelize.INTEGER
      },
      1970: {
        type: Sequelize.INTEGER
      },
      1971: {
        type: Sequelize.INTEGER
      },
      1972: {
        type: Sequelize.INTEGER
      },
      1973: {
        type: Sequelize.INTEGER
      },
      1974: {
        type: Sequelize.INTEGER
      },
      1975: {
        type: Sequelize.INTEGER
      },
      1976: {
        type: Sequelize.INTEGER
      },
      1977: {
        type: Sequelize.INTEGER
      },
      1978: {
        type: Sequelize.INTEGER
      },
      1979: {
        type: Sequelize.INTEGER
      },
      1980: {
        type: Sequelize.INTEGER
      },
      1981: {
        type: Sequelize.INTEGER
      },
      1982: {
        type: Sequelize.INTEGER
      },
      1983: {
        type: Sequelize.INTEGER
      },
      1984: {
        type: Sequelize.INTEGER
      },
      1985: {
        type: Sequelize.INTEGER
      },
      1986: {
        type: Sequelize.INTEGER
      },
      1987: {
        type: Sequelize.INTEGER
      },
      1988: {
        type: Sequelize.INTEGER
      },
      1989: {
        type: Sequelize.INTEGER
      },
      1990: {
        type: Sequelize.INTEGER
      },
      1991: {
        type: Sequelize.INTEGER
      },
      1992: {
        type: Sequelize.INTEGER
      },
      1993: {
        type: Sequelize.INTEGER
      },
      1994: {
        type: Sequelize.INTEGER
      },
      1995: {
        type: Sequelize.INTEGER
      },
      1996: {
        type: Sequelize.INTEGER
      },
      1997: {
        type: Sequelize.INTEGER
      },
      1998: {
        type: Sequelize.INTEGER
      },
      1999: {
        type: Sequelize.INTEGER
      },
      2000: {
        type: Sequelize.INTEGER
      },
      2001: {
        type: Sequelize.INTEGER
      },
      2002: {
        type: Sequelize.INTEGER
      },
      2003: {
        type: Sequelize.INTEGER
      },
      2004: {
        type: Sequelize.INTEGER
      },
      2005: {
        type: Sequelize.INTEGER
      },
      2006: {
        type: Sequelize.INTEGER
      },
      2007: {
        type: Sequelize.INTEGER
      },
      2008: {
        type: Sequelize.INTEGER
      },
      2009: {
        type: Sequelize.INTEGER
      },
      2010: {
        type: Sequelize.INTEGER
      },
      2011: {
        type: Sequelize.INTEGER
      },
      2012: {
        type: Sequelize.INTEGER
      },
      2013: {
        type: Sequelize.INTEGER
      },
      2014: {
        type: Sequelize.INTEGER
      },
      2015: {
        type: Sequelize.INTEGER
      },
      2016: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Genres');
  }
};
