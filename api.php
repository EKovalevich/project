<?php

include "main.php";
$Application = new Main();
$Application->exec($_POST['type'], isset($_POST['data']) ? $_POST['data'] : '');