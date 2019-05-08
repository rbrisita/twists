#!/usr/bin/env bash

#####
# Create schema for application to use.
#####

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <schema_name> <user_password>"
    exit 1
fi

#####
# MYSQL
#####
echo -e "\n*****\n* Creating DB Schema.\n*****\n"
# Create configuration file for MySQL installation
MYSQL_CONF_FILE="my.cnf"
cat > "${MYSQL_CONF_FILE}" <<-EOF
    [client]
    user =
    password =
EOF

SUDO_USER=${SUDO_USER:-$USER}
DB_SCHEMA=${1:?"Please enter a schema name."}
DB_USERNAME=${SUDO_USER}
DB_PASSWORD=${2:?"Please enter a password for the database user."}

# Setup up database the Homestead way and mirror Laravel's .env file.
echo -e "\n*****\n* Creating user and database schema.\n*****\n"
sudo mysql --defaults-extra-file="${MYSQL_CONF_FILE}" -e "CREATE USER IF NOT EXISTS '${DB_USERNAME}'@'0.0.0.0' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql --defaults-extra-file="${MYSQL_CONF_FILE}" -e "GRANT ALL ON *.* TO '${DB_USERNAME}'@'0.0.0.0' IDENTIFIED BY '${DB_PASSWORD}' WITH GRANT OPTION;"
sudo mysql --defaults-extra-file="${MYSQL_CONF_FILE}" -e "GRANT ALL ON *.* TO '${DB_USERNAME}'@'%' IDENTIFIED BY '${DB_PASSWORD}' WITH GRANT OPTION;"
sudo mysql --defaults-extra-file="${MYSQL_CONF_FILE}" -e "FLUSH PRIVILEGES;"
sudo mysql --defaults-extra-file="${MYSQL_CONF_FILE}" -e "CREATE DATABASE IF NOT EXISTS ${DB_SCHEMA} DEFAULT CHARACTER SET UTF8mb4 DEFAULT COLLATE utf8mb4_bin;"

echo -e "\n*****\n* Restarting MySQL.\n*****\n"
sudo systemctl restart mysql

echo  -e "To access mysql the user must: sudo mysql -u ${DB_USERNAME} -p\n"
