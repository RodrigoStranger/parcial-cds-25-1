CREATE USER 'fabianatura'@'localhost' IDENTIFIED BY 'ulasalle2025';

GRANT ALL PRIVILEGES ON *.* TO 'fabianatura'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;



GRANT SUPER ON *.* TO 'fabianatura'@'localhost'; 


SHOW VARIABLES LIKE 'log_bin_trust_function_creators';
SET GLOBAL log_bin_trust_function_creators = 1;
