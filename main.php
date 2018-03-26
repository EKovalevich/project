<?

class Main
{
    private $config;
    private $path;
    private $users;
    private $passwordGitRemote;
    private $hrefGitRemote;


    function __construct()
    {
        $this->path = $_SERVER['CONTEXT_DOCUMENT_ROOT'] . '/';

        if (file_exists('./config.php')) {
            include_once('./config.php');
            $this->config = isset($config) ? $config : false;
            if ($this->config) {
                $this->config = json_decode($this->config);
                $this->users = [
                    [
                        'login' => $this->config->login,
                        'password' => $this->config->password
                    ]
                ];

                if (isset($this->config->users)) {
                    $this->users = array_merge($this->users, $this->config->users);
                }
            }
        }
    }

    public function exec($method, $params = '')
    {
        if (method_exists($this, $method) && $method != __METHOD__) {
            $this->{$method}($params);
        } else {
            echo json_encode(['error' => "Method $method not exists"]);
        }
    }

    public function isAuth()
    {
        session_start();

        if ($this->existConfig()) {
            if (empty($this->users)) {
                return true;
            } elseif (!isset($_SESSION['gitPanelHash']) || empty($_SESSION['gitPanelHash'])) {
                return false;
            } else {
                foreach ($this->users as $user) {
                    if ($user['password'] == $_SESSION['gitPanelHash']) {
                        return true;
                    }
                }
                return false;
            }
        } else {
            return false;
        }
    }

    public function existConfig()
    {
        if (file_exists('./config.php')) {
            if ($this->config) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        };
    }

    private function authorization($data)
    {
        $data['password']=md5($data['password']);
        session_start();
        if (empty($this->users)) {
            $this->responseGenerate(true);
            return;
        } else {
            foreach ($this->users as $user) {
                if ($user['password'] == $data['password'] && $user['login']==$data['login']) {
                    $_SESSION['gitPanelHash'] = $data['password'];
                    $this->responseGenerate(true);
                    return;
                }
            }
            $this->responseGenerate(false,'Error: user not found');
            return;
        }
    }

    private function logout()
    {
        session_start();
        unset($_SESSION['gitPanelHash']);
        $this->responseGenerate(true);
    }

    private function init()
    {
        exec("cd $this->path; git init;", $output);
        echo json_encode($output);
    }

    private function status()
    {
        exec("cd $this->path; git status;", $output);
        $this->responseGenerate(true,'',$output);
    }

    private function statusGitResetHead()
    {
        $list_files = $_POST['data'];
        foreach ($list_files as $file) {
            exec("cd $this->path;git reset HEAD $file;", $output);
        }
        echo json_encode(['result' => true, 'data' => $output]);
    }

    private function statusGitRmCached()
    {
        $list_files = $_POST['data'];

        foreach ($list_files as $file) {
            exec("cd $this->path;git rm --cached $file;", $output);
        }

        echo json_encode(['result' => true, 'data' => $output]);
    }

    private function statusGitAdd()
    {
        if (isset($_POST['data'])) {
            $list_files = $_POST['data'];

            foreach ($list_files as $file) {
                exec("cd $this->path;git add $file;", $output, $result);
            }

            echo json_encode(['result' => true]);
        } else {
            echo json_encode(['result' => false]);
        }
    }

    private function statusGitRm()
    {
        $list_files = $_POST['data'];

        foreach ($list_files as $file) {
            exec("cd $this->path;git rm $file;", $output, $result);
        }

        echo json_encode(['result' => true]);
    }

    private function statusGitCheckout()
    {
        $list_files = $_POST['data'];

        foreach ($list_files as $file) {
            exec("cd $this->path;git checkout -- $file;", $output);
        }

        echo json_encode(['result' => true]);
    }

    private function includeStatus()
    {
        if (isset($_POST['data'])) {
            $list_files = $_POST['data'];

            foreach ($list_files as $file) {
                exec("cd $this->path;git add $file;", $output);
            }
            $mess = "cd $this->path;git add $file;";
            echo json_encode(['result' => true, 'data' => $output, $mess]);
        } else {
            echo json_encode(['result' => false]);
        }
    }

    private function addGitignoreStatus()
    {
        $list_files = $_POST['data'];

        foreach ($list_files as $file) {
            exec("cd $this->path; echo '$file' >> .gitignore;", $output);
        }

        echo json_encode(['result' => true, 'data' => $output]);
    }

    private function branch()
    {
        exec("cd $this->path; git branch;", $output);
        $this->responseGenerate(true,'',$output);
    }

    private function createBranch()
    {
        $name = $_POST['name'];
        exec("cd $this->path; git branch $name;", $output);
        echo json_encode($output);
    }

    private function deleteBranch()
    {
        $name = $_POST['name'];
        exec("cd $this->path; git branch -D $name;", $output);
        echo json_encode($output);
    }

    private function checkoutBranch()
    {
        $name = $_POST['name'];
        exec("cd $this->path; git checkout $name;", $output);
        echo json_encode($output);
    }

    private function updateWithMaster()
    {
        $repo = str_replace('(*password*)', $this->passwordGitRemote, $_POST['name']);
        exec("cd $this->path; git pull $repo master;", $output);
        echo json_encode($output);
    }

    private function commit()
    {
        exec("cd $this->path; git commit;", $output);
        echo json_encode($output);
    }

    private function commitMessage()
    {
        $message = $_POST['message'];
        exec("cd $this->path; git commit -m '$message';", $output);
        echo json_encode($output);
    }

    private function push()
    {
        $repo = str_replace('(*password*)', $this->passwordGitRemote, $_POST['repo']);
        $branch = str_replace([' ', '*'], '', $_POST['branch']);
        exec("cd $this->path; git push $repo $branch;", $output, $result);
        $output[] = $result == 0 ? 'Successfully' : 'Error';
        echo json_encode($output);
    }

    private function pull()
    {
        $repo = str_replace('(*password*)', $this->passwordGitRemote, $_POST['repo']);
        $branch = str_replace([' ', '*'], '', $_POST['branch']);
        exec("cd $this->path; git pull $repo $branch;", $output, $result);
        $output ?: $output[] = $result == 0 ? 'Successfully' : 'Error';
        echo json_encode($output);
    }

    private function passwordPage()
    {
        $password = md5($_POST['password']);
        if (file_exists('./config.php') && $file = file_get_contents('./config.php')) {
            $re = '/\$passwordPage=\'?(.+)\';/';

            if ($_POST['password']) {
                $result = preg_replace($re, "\$passwordPage='$password';", $file, -1, $count);
            } else {
                $result = preg_replace($re, "", $file, -1, $count);
            }

            if (!$count) {

                $arFile = file("config.php");
                $arFile = array_values(array_diff($arFile, ["\n"]));
                $arFile[0] = "<?\n";
                if (count($arFile) == 1) {
                    $arFile[1] = "\$passwordPage='$password';\n";
                    $arFile[2] = "?>";
                } else {
                    $arFile[count($arFile)] = "?>";
                    $arFile[count($arFile) - 2] = "\$passwordPage='$password';\n";
                }

                $result = implode($arFile);
            }

            $f = fopen("config.php", "w");
            fwrite($f, $result);
            fclose($f);
        } else {
            $f = fopen("config.php", "w");
            fwrite($f, "<?\n\$passwordPage='$password';\n?>");
            fclose($f);
        }
    }

    private function documetRoot()
    {
        $this->path = $_POST['path'];
        if (file_exists('./config.php') && $file = file_get_contents('./config.php')) {
            $re = '/\$this->path=\'?(.+)\';/';
            if ($this->path) {
                $result = preg_replace($re, "\$this->path='$this->path';", $file, -1, $count);
            } else {
                $result = preg_replace($re, "", $file, -1, $count);
            }

            if (!$count) {

                $arFile = file("config.php");
                $arFile = array_values(array_diff($arFile, ["\n"]));
                $arFile[0] = "<?\n";
                if (count($arFile) == 1) {
                    $arFile[1] = "\$this->path='$this->path';\n";
                    $arFile[2] = "?>";
                } else {
                    $arFile[count($arFile)] = "?>";
                    $arFile[count($arFile) - 2] = "\$this->path='$this->path';\n";
                }

                $result = implode($arFile);
            }

            $f = fopen("config.php", "w");
            fwrite($f, $result);
            fclose($f);
        } else {
            $f = fopen("config.php", "w");
            fwrite($f, "<?\n\$this->path='$this->path';\n?>");
            fclose($f);
        }
    }

    private function gitConfigResult()
    {
        $typeConfig = $_POST["typeConfig"];

        exec("cd $this->path; git config --$typeConfig --list;", $output, $result);
        $result == 0 ? '' : $output[] = 'Error';
        echo json_encode($output);
    }

    private function sendGitConfig()
    {
        $typeConfig = $_POST["typeConfig"];
        $nameConfig = $_POST["nameConfig"];
        $valueConfig = $_POST["valueConfig"];

        exec("cd $this->path; git config --$typeConfig $nameConfig \"$valueConfig\";", $output, $result);
        $result == 0 ? '' : $output[] = 'Error';
        echo json_encode($output);
    }

    private function sendDeleteGitConfig()
    {
        $typeConfig = $_POST["typeConfig"];
        $nameConfig = $_POST["nameConfig"];

        exec("cd $this->path; git config --$typeConfig --unset $nameConfig ;", $output, $result);
        $result == 0 ? '' : $output[] = 'Error';
        echo json_encode($output);
    }

    private function createGitHttpsRemote()
    {
        $href = $_POST["href"];
        $password = $_POST["password"];

        if (file_exists('./config.php') && $file = file_get_contents('./config.php')) {
            $re1 = '/\$hrefGitRemote=\'?(.+)\';/';
            $re2 = '/\$this->passwordGitRemote=\'?(.+)\';/';

            if ($href) {
                $result = preg_replace($re1, "\$hrefGitRemote='$href';", $file, -1, $count);
            } else {
                $result = preg_replace($re1, "", $file, -1, $count);

            }

            if (!$count && $href != '') {
                $arFile = file("config.php");
                $arFile = array_values(array_diff($arFile, ["\n"]));
                $arFile[0] = "<?\n";
                if (count($arFile) == 1) {
                    $arFile[1] = "\$hrefGitRemote='$href';\n";
                    $arFile[2] = "?>";
                } else {
                    $arFile[count($arFile)] = "?>";
                    $arFile[count($arFile) - 2] = "\$hrefGitRemote='$href';\n";
                }

                $result = implode($arFile);
            }

            $f = fopen("config.php", "w");
            fwrite($f, $result);
            fclose($f);

            $file = $result;

            if ($password) {
                $result = preg_replace($re2, "\$this->passwordGitRemote='$password';", $file, -1, $count);
            } else {
                $result = preg_replace($re2, "", $file, -1, $count);
            }

            if (!$count && $password != '') {

                $arFile = file("config.php");
                $arFile = array_values(array_diff($arFile, ["\n"]));
                $arFile[0] = "<?\n";
                if (count($arFile) == 1) {
                    $arFile[1] = "\$this->passwordGitRemote='$password';\n";
                    $arFile[2] = "?>";
                } else {
                    $arFile[count($arFile)] = "?>";
                    $arFile[count($arFile) - 2] = "\$this->passwordGitRemote='$password';\n";
                }

                $result = implode($arFile);
            }


            $f = fopen("config.php", "w");
            fwrite($f, $result);
            fclose($f);

        } else {
            $f = fopen("config.php", "w");
            fwrite($f, "<?\n\$hrefGitRemote='$href'\n\$this->passwordGitRemote='$password';\n?>");
            fclose($f);
        }

        echo json_encode(['result' => $result]);
    }

    private function test()
    {
        echo json_encode(['result' => true]);
    }

    private function startConfig($data)
    {
        if (!$this->existConfig()) {
            if (!$data['notUsers']) {
                $data['password'] = md5($data['password']);
            }
            $this->updateConfig($data);
            $this->responseGenerate(true);
        } else {
            $this->responseGenerate(false, 'Error: Config file exist');
        }
    }

    private function updateConfig($data)
    {
        $f = fopen("config.php", "w");
        fwrite($f, "<?\n\$config='" . json_encode($data) . "';\n?>");
        fclose($f);
    }

    private function responseGenerate($type, $message = '', $data = [])
    {
        echo json_encode(['result' => $type, 'message' => $message, 'data' => $data]);
    }


}