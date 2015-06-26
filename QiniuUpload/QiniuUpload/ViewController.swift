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
    
    var count = 0
    
    var canceled = false
    
    var results = [String : Bool]()

    let uploadMananger = QNUploadManager.sharedInstanceWithConfiguration(nil)
    
    let operationQueue = NSOperationQueue()
    
    var upload: UpLoadManager!
    
    let token = "zXqNlKjpzQpFzydm6OCcngSa76aVNp-SwmqG-kUy:SsX0ApPe-2VPzeU9WcvVyBQfw_s=:eyJzY29wZSI6ImN1cmlvc3B1Ymxpc2giLCJkZWFkbGluZSI6MTQzNTAzMTc2OH0="
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let mainDirURL = NSBundle.mainBundle().resourceURL!.URLByAppendingPathComponent("CuriosPreviewDemo")
        let fileKeys = getFileKeys(mainDirURL, keyPrefix: "Emiaostein1")
        
        upload = UpLoadManager(aFileKeys: fileKeys, aToken: token) { (result, finished) -> Void in
            
            println(result)
        }
        
        upload.start()
    }
    
    func getFileKeys(rootURL: NSURL, keyPrefix: String) -> [String : String] {
        
        let fileManger = NSFileManager.defaultManager()
        
        
        var error = NSErrorPointer()
        let mainDirEntries = fileManger.enumeratorAtURL(rootURL, includingPropertiesForKeys: nil, options: NSDirectoryEnumerationOptions.SkipsPackageDescendants | NSDirectoryEnumerationOptions.SkipsHiddenFiles) { (url, error) -> Bool in
            println(url.lastPathComponent)
            return true
        }
        
        var dics = [String : String]()
        while let url = mainDirEntries?.nextObject() as? NSURL {

            var flag = ObjCBool(false)
            fileManger.fileExistsAtPath(url.path!, isDirectory: &flag)
            if flag.boolValue == false {
                
                let relativePath = url.pathComponents?.reverse()
                var relative = ""
                for path in relativePath as! [String] {
                    
                    if path != "main" {
                        relative = ("/" + path + relative)
                    } else {
                        break
                    }
                }
                let key = keyPrefix + relative
                dics[key] = url.path!
            }
        }
        return dics
    }

    @IBAction func stopAction(sender: UIButton) {
        
        upload.cancel()
    }
}

