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
    
    let operationQueue = NSOperationQueue()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        var ar = [UploadOperation]()
        for index in 0...100 {
            
            let uploadOperation = UploadOperation(aToken: "\(index)", aKey: "EMiaostain-Key")
//            uploadOperation.completionBlock = { println("hahahaha" + "\(index)") }
            ar.append(uploadOperation)
        }
        
        NSBlockOperation
        
        self.addObserver(self, forKeyPath: "operationQueue.operationCount", options: NSKeyValueObservingOptions.New, context: nil)
        operationQueue.maxConcurrentOperationCount = 1
        operationQueue.addOperations(ar, waitUntilFinished: false)

    }
    
    override func observeValueForKeyPath(keyPath: String, ofObject object: AnyObject, change: [NSObject : AnyObject], context: UnsafeMutablePointer<Void>) {

        if let count = change[NSKeyValueChangeNewKey] as? Int {
            if count == 0 {
                println("完成")
            }
        } else {
            
        }
    }
    

    
    func getUploadResourceList() -> [String : String] {
        
        let fileManger = NSFileManager.defaultManager()
        let mainDirURL = NSBundle.mainBundle().resourceURL?.URLByAppendingPathComponent("main")
        
        var error = NSErrorPointer()
        let mainDirEntries = fileManger.enumeratorAtURL(mainDirURL!, includingPropertiesForKeys: nil, options: NSDirectoryEnumerationOptions.SkipsPackageDescendants | NSDirectoryEnumerationOptions.SkipsHiddenFiles) { (url, error) -> Bool in
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
                
                dics[relative] = url.path!
            }
        }
        return dics
    }
    
    func uploadTest() {
        
        let dics = getUploadResourceList()
        
        let token = "zXqNlKjpzQpFzydm6OCcngSa76aVNp-SwmqG-kUy:s6wUmG-4lx0zKScKGMTMZnKWWeA=:eyJzY29wZSI6ImN1cmlvc3B1Ymxpc2giLCJkZWFkbGluZSI6MTQzNDcwMjQxMH0="
        for (relativePath, filePath) in dics {
            
        uploadMananger.putFile(filePath, key: token + relativePath, token: token, complete: { (ResponseInfo, key, response) -> Void in
            
            println(response)
        }, option: nil)
            
        }
    }


}

