<?php

use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
$mail = require __DIR__ . "/mailSetup.php";
$defaultRecipient = "kontakt@jfgoldbach.de";
$defaultRecipientName = "Ju";

error_reporting(E_ALL & ~E_NOTICE);


function sendMail($htmlMsg, $type= null, $altMsg = null,
    $sendTo = null, $sendToName = null, 
    $subject = null,
    $replyAddress = null, $replyName = null)
{
    global $defaultRecipient;
    global $defaultRecipientName;

    try {
        //Server settings
        global $mail;   //so it is accessiable from inside the function

        //Set from - its always the same
        $mail->setFrom('noreply@jfgoldbach.de', 'jfgoldbach.de');

        //Add reply, if any
        if (isset($replyAddress)) {
            $reply__Name = "-";
            if (isset($replyName)) {
                $reply__Name = $replyName;
            }

            $mail->addReplyTo($replyAddress, $reply__Name);
        }


        //Add recipient
        if (isset($sendTo)) {
            $to__Name = "-";
            if(isset($sendToName)){
                $to__Name = $sendToName;
            }
            $mail->addAddress($sendTo, $to__Name);
        } else {
            $mail->addAddress($defaultRecipient, $defaultRecipientName);
            $mail->addAddress("jfg.msg@protonmail.com", "Ju");
        }

        //Content
        $headline__convert = array("contactForm"=>"Kontaktformular", "contactForm__copy"=>"Meine Nachricht");
        $headline = $headline__convert[$type] ?? "Nachricht";
        $sanitizedMsg = htmlspecialchars($htmlMsg);
        $msg = preg_replace(['/\A&quot;/', '/&quot;\Z/', '/\\\n/m'], ["", "", "&#10;&#13;"], $sanitizedMsg);

        $html = '<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mail von jfgoldbach.de</title>
            <style>
                body{
                    padding: 16px;
                    font-family: Arial, Helvetica, sans-serif;
                }
                body > div {
                    background-color: #6bbdff;
                    border-radius: 12px;
                    box-shadow: 0 0 12px rgba(0,0,0, 0.33);
                    overflow: hidden;
                }
                header{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 12px;
                    background-color: #1f3f69;
                    box-shadow: 0 0 8px rgba(0,0,0, 0.33);
                }
                header img{
                    transition: 0.1s;
                    background-color: #974bb2;
                    border-bottom-right-radius: 12px;
                    width: 54px;
                    height: 54px;
                    padding: 8px;
                }
                header img:hover{
                    background-color: #c379de;
                }
                header h1{
                    color: white;
                    margin: 0;
                }
                header a{
                    height: 54px;
                    box-shadow: -4px 18px 8px rgba(0,0,0, 0.33);
                }
                .msgContainer{
                    padding: 32px;
                }
                .msgContainer p{
                    white-space: pre-wrap;
                    line-height: 1.125rem;
                }
                .endLink{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    gap: 6px;
                    margin: 8px;
                    font-size: 0.8rem;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div>
                <header>
                    <a href="https://jfgoldbach.de" target="_blank" title="jfgoldbach.de besuchen">
                        <img src="https://jfgoldbach.de/images/favicon.ico">
                    </a>
                    <h1>' . $headline .'</h1>
                </header>
                <div class="msgContainer">
                    <h2>Nachricht:</h2>
                    <p>'. $msg . '</p>
                </div>
                <div class="endLink">
                    <span>gesendet von</span>
                    <a href="https://jfgoldbach.de" target="_blank">
                        jfgoldbach.de
                    </a>
                </div>
            </div>
        </body>
        </html>';

        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Nachricht von jfgoldbach.de';
        if (isset($subject)) {
            $mail->Subject = $subject;
        }
        if (isset($htmlMsg)) {
            $mail->Body    = $html;
            if(isset($altMsg)){
                $mail->AltBody = $altMsg;
            } else {
                $mail->AltBody = "Dies ist eine Nachricht von jfgoldbach.de - Es wurde kein alternativer Nachrichtenkörper bereitgestellt.";
            }
        } else {
            die("Expected a message but got none.");
            http_response_code(400);
        };
        

        //$mail->msgHTML(file_get_contents('mails/loginWarningMail.html'));


        $mail->send();

        return '{"success": true}';
    } catch (Exception $e) {
        return '{"success": false, "error": {$mail->ErrorInfo}, "exception": {$e}}';
    }
}

?>