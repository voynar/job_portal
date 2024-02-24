<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$config = require('/var/www/config.php');

#[AllowDynamicProperties]
class DB {
    private $dbHost;
    private $dbUsername;
    private $dbPassword;
    private $dbName;

    public function __construct() {
        global $config; // Access the config variable

        $this->dbHost = "localhost";
        $this->dbUsername = $config['dbUsername'];
        $this->dbPassword = $config['dbPassword'];
        $this->dbName = $config['dbName'];

        if (!extension_loaded('mysqli')) {
            die("The mysqli extension is not available or enabled.");
        }

        if(!isset($this->db)) {
            // Connect to the database
            $conn = new mysqli($this->dbHost, $this->dbUsername, $this->dbPassword, $this->dbName);
            if($conn->connect_error){
                die("Failed to connect with MySQL: " . $conn->connect_error);
            } else {
                $this->db = $conn;
            }
        }
    }

    public function is_table_empty() {
        $sql = 'SELECT id FROM tokens WHERE provider = ?';
        if($stmt = $this->db->prepare($sql)){
            $stmt->bind_param('s', $provider);
            $stmt->execute();
            $stmt->store_result();
            $rows = $stmt->num_rows;
            $stmt->close();
            return true;
        } else {
           var_dump($this->db->error);
        }
    }

    public function get_refresh_token() {
        $sql = $this->db->query("SELECT provider_value FROM tokens WHERE provider = 'google'");
        $result = $sql->fetch_assoc();
        return $result['provider_value'];
    }

    public function update_refresh_token($token) {
        if($this->is_table_empty()) {
            $sql = sprintf("INSERT INTO tokens(provider, provider_value) VALUES('%s', '%s')", 'google', $this->db->real_escape_string($token));
            $this->db->query($sql);
        } else {
            $sql = sprintf("UPDATE tokens SET provider_value = '%s' WHERE provider = '%s'", $this->db->real_escape_string($token), 'google');
            $this->db->query($sql);
        }
    }
}
