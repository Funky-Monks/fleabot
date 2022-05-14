import {MessageHandler} from "./messageHandler";
import {Message, MessageAttachment} from "discord.js";
import j from "jimp"

export class SquareHandler extends MessageHandler {
    triggerMessageSubstrings(): string[] {
        return ["square"]
    }

    async handle(message: Message): Promise<void> {
        if (message.attachments.size < 1) {
          message.channel.send("Add an attachment to convert it to a cube");
        }
        var u: string = <string> message.attachments.at(0)?.url
        j.read(u).then((img: j) => {
          img.resize(Math.max(img.bitmap.width,img.bitmap.height),Math.max(img.bitmap.width,img.bitmap.height))
          console.log(img.bitmap.width)
            var out: j = new j(img.bitmap.width, img.bitmap.height, (err: Error, o: j) => {
              o.scan(0,0,o.bitmap.width,o.bitmap.height, function(x: number, y: number, idx: number){
                var u = ((x/o.bitmap.width)*2 - 1)*Math.sqrt(1-((((y/o.bitmap.height)*2 -1)**2)/2)),
                    v = ((y/o.bitmap.height)*2 -1)*Math.sqrt(1-((((x/o.bitmap.width)*2 - 1)**2)/2));
                    u = Math.round((u+1)/2 * o.bitmap.width)
                    v = Math.round((v+1)/2 * o.bitmap.height)
                    o.setPixelColor(img.getPixelColor(u,v), x,y)
                })
              o.getBuffer(j.MIME_PNG, (err, buffer) => {
                message.channel.send({files:[
                  new MessageAttachment(buffer,"square.png")
                ]})
              });
            })
        })
    }
}
