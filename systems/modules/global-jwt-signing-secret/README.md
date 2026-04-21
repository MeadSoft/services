# Global JWT Signing Secret

![status](https://img.shields.io/badge/status-draft-red)

## Purpose

The global JWT signing secret value is intended to be used to sign network packets going in and out of applications. By using a common, global signing key, different applications can decode other applications encrypted messages.

The primary use of this is to prevent the need for _different_ services to request a new token when they talk to each other. Instead, they try to decrypt the message with the JWT signing key and trust is based on the success of that action.
