from flotype.bridge import Bridge
bridge = Bridge(api_key='abcdefgh') # new code: using public key
import cleverbot
mycb=cleverbot.Session()
class CleverBot(object):
  def ask(self,string,callback):
    callback(mycb.Ask(string))
bridge.publish_service("cleverbot",CleverBot())
bridge.get_service('cleverbot')
bridge.connect()
