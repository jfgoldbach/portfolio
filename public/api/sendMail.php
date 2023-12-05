<?php

use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
$mail = require __DIR__ . "/mailSetup.php";
$defaultRecipient = "kontakt@jfgoldbach.de";
$defaultRecipientName = "Ju";

error_reporting(E_ALL & ~E_NOTICE);


function sendMail($htmlMsg, $altMsg = null,
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
        }

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Nachricht von jfgoldbach.de';
        if (isset($subject)) {
            $mail->Subject = $subject;
        }
        if (isset($htmlMsg)) {
            $mail->Body    = htmlspecialchars($htmlMsg);
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