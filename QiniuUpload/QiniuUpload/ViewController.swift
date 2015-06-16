//
//  ViewController.swift
//  QiniuUpload
//
//  Created by Emiaostein on 6/11/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit
import Qiniu

class ViewController: UIViewController {

    let uploadMananger = QNUploadManager.sharedInstanceWithConfiguration(nil)
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        uploadTest()
    }
    
    func uploadTest() {
        
        let bundlePath = NSBundle.mainBundle().resourcePath?.stringByAppendingPathComponent("SDF.png")
        let bundleURL = NSURL(fileURLWithPath: bundlePath!, isDirectory: false)
        
        
        let token = "zXqNlKjpzQpFzydm6OCcngSa76aVNp-SwmqG-kUy:5W5zZ8hZSkN3e3GZenbJdp3hBNQ=:eyJzY29wZSI6ImN1cmlvcyIsImRlYWRsaW5lIjoxNDM0MDEwODA4fQ=="
        
        let data = NSData(contentsOfURL: bundleURL!, options: NSDataReadingOptions(0), error: nil)
        uploadMananger.putData(data, key: "TEST/SDF.png", token: token, complete: { (responseInfo, Key, [NSObject : AnyObject]!) -> Void in
            
            println(responseInfo)
            
        }, option: nil)
    }


}

