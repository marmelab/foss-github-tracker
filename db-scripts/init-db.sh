echo "Init db from dump"

psql -U alexisjanvier -h localhost -d foss_analyse -f /db-scripts/dropTables.sql
psql -U alexisjanvier foss_analyse < /dumps/foss_analyse.dump
