#!/bin/bash

# Parse command line arguments
database=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --database-name)
            database="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if required argument is provided
if [[ -z "$database" ]]; then
    echo "Error: --database-name is required"
    exit 1
fi

#############################################################
# part 3: setting up the postgres users access to the database

hba_conf=$(ls /etc/postgresql/*/main/pg_hba.conf 2>/dev/null | head -n 1)

if [[ -z "$hba_conf" ]]; then
    echo "Error: pg_hba.conf not found"
    exit 1
fi

line_to_add="hostssl $database       postgres        0.0.0.0/24        scram-sha-256"

if ! grep -qF "$line_to_add" "$hba_conf"; then
    echo "$line_to_add" | sudo tee -a "$hba_conf" > /dev/null
    echo "Added line to $hba_conf"
    echo "Restarting PostgreSQL service..."
    sudo systemctl restart postgresql.service
else
    echo "Line already exists in $hba_conf"
fi
echo "Postgres user access configured for database '$database' on '0.0.0.0'"
