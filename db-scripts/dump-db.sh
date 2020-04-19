echo "Dump db"

rm -f /dumps/foss_analyse.dump
pg_dump -U alexisjanvier foss_analyse > /dumps/foss_analyse.dump
