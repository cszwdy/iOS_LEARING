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
    
    let token = "zXqNlKjpzQpFzydm6OCcngSa76aVNp-SwmqG-kUy:32fZPTY9NV3M7sk5c64DuU7ViZI=:eyJzY29wZSI6ImN1cmlvc3B1Ymxpc2giLCJkZWFkbGluZSI6MTQzNDg2NjQ2NX0="
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let mainDirURL = NSBundle.mainBundle().resourceURL!.URLByAppendingPathComponent("main")
        let fileKeys = getFileKeys(mainDirURL, keyPrefix: "Emiaostein")
        
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
    
//    func uploadTest() {
//        
//        let dics = getUploadResourceList()
//        
//        let defaultOptions = QNUploadOption.defaultOptions()
//        let cancelSignal = { () -> Bool in
//            
//            return self.canceled
//        }
//        
//        let customOptions = QNUploadOption(mime: defaultOptions.mimeType, progressHandler: { (key, progress) -> Void in
//            
////            println("\(key) = \(progress)")
//            
//            }, params: defaultOptions.params, checkCrc: defaultOptions.checkCrc, cancellationSignal: cancelSignal)
//        
//        let token = "zXqNlKjpzQpFzydm6OCcngSa76aVNp-SwmqG-kUy:OVpEiAgMEs8PUgMxIsZNcfjsPHs=:eyJzY29wZSI6ImN1cmlvc3B1Ymxpc2giLCJkZWFkbGluZSI6MTQzNDg0NjQzMH0="
//        
//        let totalCount = dics.count
//        for (relativePath, filePath) in dics {
//            
//            let aKey = "Emiaostein" + relativePath
//            results[aKey] = false
//            
//        uploadMananger.putFile(filePath, key: aKey, token: token, complete: { (ResponseInfo, key, response) -> Void in
//            
//            if response != nil {
//                
//                self.results[key] = true
//                
//            } else {
//                
//                self.canceled = false
//            }
//            
//        }, option: customOptions)
//            
//        }
//    }


    @IBAction func stopAction(sender: UIButton) {
        
        upload.cancel()
    }
}

