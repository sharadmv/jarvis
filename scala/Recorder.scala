import flanagan.math._
import flanagan.plot._
import javax.sound.sampled._
import java.io._
import java.nio._
import scala.collection.mutable._
object Recorder {
  def main(args:Array[String]){
    var format = new AudioFormat(32000.0f,16,1, true, true);
    var mic = AudioSystem.getTargetDataLine(format);
    mic.open()
    mic.start()
    var bufferSize:Int = format.getSampleRate().asInstanceOf[Int]
    var buffer:Array[Byte] = new Array[Byte](bufferSize)
    var out = new FileOutputStream(new File("temp"))
    var start = System.currentTimeMillis()
    var time:LinkedList[Double] = new LinkedList[Double]()
    while (System.currentTimeMillis() - start < 3000) {
      var count:Int = mic.read(buffer,0,buffer.length)
      if (count > 0){
        out.write(buffer,0,count)
      }
    }
    var dubs:Array[Double] = new Array[Double](buffer.length)
    for (i <- 0 until buffer.length){
      time = time :+ (i+0.0)
      dubs(i) = buffer(i).asInstanceOf[Double]
    }
    var graph:PlotGraph = new PlotGraph(time.toArray,dubs)
    graph.plot()
    var ft:FourierTransform = new FourierTransform(dubs)
      ft.setDeltaT(1.0D/32000)
      ft.plotPowerSpectrum()


      /*
      var mixerInfos:Array[Mixer.Info] = AudioSystem.getMixerInfo()
      for (info <- mixerInfos){
        var m = AudioSystem.getMixer(info)
          var lineInfos:Array[Line.Info] = m.getSourceLineInfo()
          for (lineInfo <- lineInfos) {
            println(info.getName()+"---"+lineInfo)
            var line:Line = m.getLine(lineInfo)
            println("\t-----"+line)
          }
          lineInfos = m.getTargetLineInfo()
          for (lineInfo <- lineInfos) {
            println(m+"---"+lineInfo)
            var line:Line = m.getLine(lineInfo)
            println("\t-----"+line)
          }
      }
      */
  }
}
